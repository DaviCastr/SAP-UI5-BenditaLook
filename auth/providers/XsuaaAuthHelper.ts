import { UserSession } from "../models/UserSession";

interface AuthConfig {
    authDomain: string;
    clientId: string;
    scope: string;
    redirectUri: string;
    tokenEndpoint: string;
    refreshEndpoint: string;
}

export interface RuntimeConfig {
    catalogService: string;
    adminService: string;
    auth?: AuthConfig;
}

interface TokenResponse {
    access_token: string;
    expires_in?: number;
    refresh_token?: string;
    id_token?: string;
    user_name?: string;
    error?: string;
    error_description?: string;
}

const LOCAL_CATALOG_SERVICE = "/api/service/Catalog/";
const LOCAL_ADMIN_SERVICE = "/api/service/BenditaLook/";
const DEFAULT_TOKEN_LIFETIME_SECONDS = 3600;
const MIN_TOKEN_LIFETIME_SECONDS = 60;

let runtimeConfig: RuntimeConfig = {
    catalogService: LOCAL_CATALOG_SERVICE,
    adminService: LOCAL_ADMIN_SERVICE
};

export class XsuaaAuthHelper {

    public static getConfig(): RuntimeConfig {
        return runtimeConfig;
    }

    public static setLocalOverrides(): void {
        runtimeConfig.catalogService = LOCAL_CATALOG_SERVICE;
        runtimeConfig.adminService = LOCAL_ADMIN_SERVICE;

        if (runtimeConfig.auth) {
            runtimeConfig.auth.tokenEndpoint = "/auth/login";
            runtimeConfig.auth.refreshEndpoint = "/auth/refresh";
            runtimeConfig.auth.redirectUri = "";
        }
    }

    public static createAuthorizationFlow(): { authorizeUrl: string; state: string } {
        const config = this.getConfig().auth;

        if (!config?.clientId || !config.authDomain) {
            throw new Error("XSUAA client configuration is missing in runtime-config.json");
        }

        const state = this.generateRandomString(32);
        const params = new URLSearchParams({
            response_type: "code",
            client_id: config.clientId,
            redirect_uri: this.getRedirectUri(),
            scope: config.scope || "openid",
            state
        });

        return { authorizeUrl: `${config.authDomain}/oauth/authorize?${params.toString()}`, state };
    }

    public static async exchangeAuthorizationCode(code: string): Promise<TokenResponse> {
        const endpoint = this.getConfig().auth?.tokenEndpoint;

        if (!endpoint) {
            throw new Error("Token endpoint is not configured");
        }

        return this.postToken(endpoint, { code, redirect_uri: this.getRedirectUri() });
    }

    public static async refresh(refreshToken: string): Promise<TokenResponse> {
        const endpoint = this.getConfig().auth?.refreshEndpoint;

        if (!endpoint) {
            throw new Error("Refresh endpoint is not configured");
        }

        return this.postToken(endpoint, { refresh_token: refreshToken });
    }

    public static createSession(tokenResponse: TokenResponse): UserSession {
        const expiresIn = Math.max(tokenResponse.expires_in ?? DEFAULT_TOKEN_LIFETIME_SECONDS, MIN_TOKEN_LIFETIME_SECONDS);

        return {
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token,
            expiresAt: Date.now() + (expiresIn * 1000),
            userName: tokenResponse.user_name ?? this.extractUserName(tokenResponse.id_token) ?? ""
        };
    }

    public static getRedirectUri(): string {
        const configured = this.getConfig().auth?.redirectUri;

        if (configured) {
            return configured;
        }

        const currentUrl = new URL(window.location.href);
        currentUrl.search = "";
        currentUrl.hash = "";

        return currentUrl.toString();
    }

    public static async loadRuntimeConfig(): Promise<void> {
        const url = sap.ui.require.toUrl("apps/dflc/benditalook/config/runtime-config.json");
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Runtime configuration could not be loaded");
        }

        const payload = await response.json() as Partial<RuntimeConfig>;

        runtimeConfig = {
            catalogService: payload.catalogService || LOCAL_CATALOG_SERVICE,
            adminService: payload.adminService || LOCAL_ADMIN_SERVICE,
            auth: payload.auth
        };
    }

    private static async postToken(endpoint: string, body: Record<string, string>): Promise<TokenResponse> {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const payload = await response.json() as TokenResponse;

        if (!response.ok || payload.error) {
            throw new Error(payload.error_description ?? payload.error ?? "Token request failed");
        }

        return payload;
    }

    private static generateRandomString(length: number): string {
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const values = new Uint8Array(length);
        crypto.getRandomValues(values);

        return Array.from(values, (value) => possible[value % possible.length]).join("");
    }

    private static extractUserName(token?: string): string | null {
        const payload = token?.split(".")[1];

        if (!payload) {
            return null;
        }

        try {
            const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
            const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
            const decoded = decodeURIComponent(Array.from(atob(padded), (character) =>
                "%" + ("00" + character.charCodeAt(0).toString(16)).slice(-2)
            ).join(""));
            const claims = JSON.parse(decoded) as Record<string, string | undefined>;

            return claims.given_name ?? claims.user_name ?? claims.name ?? null;
        } catch {
            return null;
        }
    }

}
