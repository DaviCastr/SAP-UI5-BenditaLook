import { AuthenticationService } from "../auth/AuthenticationService";
import { XsuaaAuthHelper } from "../auth/providers/XsuaaAuthHelper";

export class BackendUnavailableError extends Error {
    public constructor() {
        super("Backend unavailable");
        this.name = "BackendUnavailableError";
    }
}

export class SessionExpiredError extends Error {
    public constructor() {
        super("Session expired");
        this.name = "SessionExpiredError";
    }
}

export class RequestFailedError extends Error {
    public constructor(message: string, public readonly status: number) {
        super(message);
        this.name = "RequestFailedError";
    }
}

export function buildAuthHeaders(headers: HeadersInit = {}): Headers {
    const result = new Headers(headers);
    const token = AuthenticationService.getSession()?.accessToken;

    if (token) {
        result.set("Authorization", `Bearer ${token}`);
    }

    return result;
}

export async function adminRequest(path: string, init: RequestInit = {}): Promise<Response> {
    let response: Response;

    try {
        response = await fetch(`${XsuaaAuthHelper.getConfig().adminService}${path}`, {
            ...init,
            headers: buildAuthHeaders(init.headers)
        });
    } catch {
        throw new BackendUnavailableError();
    }

    if (response.status === 401) {
        AuthenticationService.notifySessionExpired();
        throw new SessionExpiredError();
    }

    if (!response.ok) {
        throw new RequestFailedError(await readErrorMessage(response), response.status);
    }

    return response;
}

async function readErrorMessage(response: Response): Promise<string> {
    try {
        const payload = await response.json() as { error?: { message?: string } };
        return payload.error?.message ?? response.statusText;
    } catch {
        return response.statusText;
    }
}

export function isSessionExpiredError(error: unknown): boolean {
    return error instanceof SessionExpiredError;
}

export function isBackendUnavailableError(error: unknown): boolean {
    return error instanceof BackendUnavailableError;
}
