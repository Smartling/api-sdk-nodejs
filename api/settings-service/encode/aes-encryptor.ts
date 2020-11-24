import crypto from "crypto";
import Encryptor from "./encryptor";

export default class AesEncryptor implements Encryptor {
    public encrypt(subject: string, password: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes256', password, iv);
        const outputEncoding = 'hex';
        let ciphered = cipher.update(subject, 'utf8', outputEncoding);
        ciphered += cipher.final(outputEncoding);

        return iv.toString(outputEncoding) + ':' + ciphered;
    }
}
