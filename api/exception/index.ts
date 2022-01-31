class SmartlingException extends Error {
    protected payload: Record<string, unknown>;
    protected nestedException: Error;

    constructor(message: string, payload: Record<string, unknown> = {}, e: Error = null) {
        super(message);
        this.payload = payload;
        this.nestedException = e;
    }

    public getPayload(): Record<string, unknown> {
        return this.payload;
    }

    public getNestedException(): Error {
        return this.nestedException;
    }
}

SmartlingException.prototype.toString = function smartlingExceptionToString() {
    return `${this.message}, payload=${JSON.stringify(this.payload)}, stack=${this.stack}, \n${this.nestedException ? this.nestedException : ""}`;
};

export { SmartlingException };
