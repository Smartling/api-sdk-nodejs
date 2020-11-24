import crypto from "crypto";
import Decryptor from "./decryptor";

export default class AesDecryptor implements Decryptor {
    public decrypt(subject: string, password: string): string {
        const inputEncoding = 'hex';
        const outputEncoding = 'utf8';

        const parts = subject.split(':');
        const iv = Buffer.from(parts.shift(), inputEncoding);
        const decipher = crypto.createDecipheriv('aes256', password, iv);
        return decipher.update(parts.join(':'), inputEncoding, outputEncoding) + decipher.final(outputEncoding);
    }
}
