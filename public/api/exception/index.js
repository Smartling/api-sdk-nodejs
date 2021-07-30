class SmartlingException extends Error {
    constructor(message, payload, e = null) {
        super(message);
        this.payload = payload;
        this.nestedException = e;
    }
}

SmartlingException.prototype.toString = function smartlingExceptionToString() {
    return `${this.message}, payload=${JSON.stringify(this.payload)}, stack=${this.stack}, \n${this.nestedException ? this.nestedException : ""}`;
};

module.exports = SmartlingException;
