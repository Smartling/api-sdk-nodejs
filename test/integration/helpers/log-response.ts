export function logResponse(label: string, response: unknown): void {
    // Read fresh on every call rather than freezing into a module-level constant at import
    // time: this module is `require`d (by each spec file's own imports) before that same
    // spec file's `dotenv.config()` call runs, and the require is cached - so a constant
    // computed once here would always see pre-dotenv env vars, regardless of .env's content.
    if (process.env.SMARTLING_LOG_RESPONSES !== "true") {
        return;
    }

    // eslint-disable-next-line no-console
    console.log(`\n--- ${label} ---\n${JSON.stringify(response, null, 2)}`);
}
