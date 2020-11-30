export default class DecryptionError extends Error {
    public original?: Error;
    constructor(message: string, original?: Error) {
        super(message);
        this.original = original;
    }
}
