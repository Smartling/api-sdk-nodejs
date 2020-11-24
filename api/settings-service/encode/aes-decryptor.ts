import crypto from "crypto";
import Decryptor from "./decryptor";

export default class AesDecryptor implements Decryptor {
    public decrypt(subject: string, password: string): string {
        const parts = subject.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        const decipher = crypto.createDecipheriv('aes256', password, iv);
        let result = decipher.update(parts.join(':'), 'hex', 'utf8');
        result += decipher.final('utf8');

        return result;
    }
}
