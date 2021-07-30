import AbstractCodec from "./abstract-codec";

export default class NoOpCodec extends AbstractCodec {
    public decrypt(subject: string): string {
        return subject;
    }

    public encrypt(subject: string): string {
        return subject;
    }
}
