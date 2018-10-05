class SmartlingException extends Error {
    constructor(message, payload, e = null) {
        super(message);
        this.payload = payload;
        this.nestedException = e;
    }

    // The setter and the getter should only be used when we have more logic to add.
}
SmartlingException.prototype.toString = function smartlingExceptionToString() {
    return `message=${this.message}, payload=${JSON.stringify(this.payload)}, stack=${this.stack}, nestedException=${this.nestedException}`;
};

module.exports = SmartlingException;
