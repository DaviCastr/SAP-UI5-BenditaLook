const GENERIC_TRANSPORT_ERROR = /^(Communication error|Network error|Failed to fetch)/i;

export function getBackendErrorMessage(error: unknown): string | undefined {
    const visited = new Set<unknown>();
    let current: unknown = error;

    while (current && !visited.has(current)) {
        visited.add(current);

        const candidate = current as {
            error?: { message?: unknown };
            message?: unknown;
            cause?: unknown;
        };

        const backendMessage = candidate.error?.message;

        if (typeof backendMessage === "string" && backendMessage.trim()) {
            return backendMessage;
        }

        if (typeof candidate.message === "string" && candidate.message.trim() && !GENERIC_TRANSPORT_ERROR.test(candidate.message)) {
            return candidate.message;
        }

        current = candidate.cause;
    }

    return undefined;
}
