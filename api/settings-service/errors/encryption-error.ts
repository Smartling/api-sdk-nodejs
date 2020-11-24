export default class EncryptionError extends Error {
    public original?: Error;
    constructor(message: string, original?: Error) {
        super(message);
        this.original = original;
    }
}
