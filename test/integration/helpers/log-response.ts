const logResponsesEnabled = process.env.SMARTLING_LOG_RESPONSES === "true";

export function logResponse(label: string, response: unknown): void {
    if (!logResponsesEnabled) {
        return;
    }

    // eslint-disable-next-line no-console
    console.log(`\n--- ${label} ---\n${JSON.stringify(response, null, 2)}`);
}
