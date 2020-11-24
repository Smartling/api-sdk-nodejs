import crypto from "crypto";
import Encryptor from "./encryptor";

export default class AesEncryptor implements Encryptor {
    public encrypt(subject: string, password: string): string {
        const inputEncoding = 'utf8';
        const outputEncoding = 'hex';

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes256', password, iv);
        return iv.toString(outputEncoding) + ':' + cipher.update(subject, inputEncoding, outputEncoding) + cipher.final(outputEncoding);
    }
}
