interface Logger {
    debug,
    warn,
    error,
    [index: string]: unknown
}

export { Logger };
