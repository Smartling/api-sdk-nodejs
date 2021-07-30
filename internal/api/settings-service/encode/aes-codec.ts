import AbstractCodec from "./abstract-codec";
import crypto, { CipherKey } from "crypto";

export default class AesCodec extends AbstractCodec {
    public key: CipherKey;

    constructor(key: CipherKey = '') {
        super();
        this.key = key;
    }

    public decrypt(subject: string): string {
        const inputEncoding = 'hex';
        const outputEncoding = 'utf8';

        const parts = subject.split(':');
        const decipher = crypto.createDecipheriv('aes256', this.key, Buffer.from(parts.shift(), inputEncoding));
        return decipher.update(parts.join(':'), inputEncoding, outputEncoding) + decipher.final(outputEncoding);
    }

    public encrypt(subject: string): string {
        const inputEncoding = 'utf8';
        const outputEncoding = 'hex';

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes256', this.key, iv);
        return iv.toString(outputEncoding) + ':' + cipher.update(subject, inputEncoding, outputEncoding) + cipher.final(outputEncoding);
    }
}
