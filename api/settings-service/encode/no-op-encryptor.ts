import Encryptor from "./encryptor";

export default class NoOpEncryptor implements Encryptor {
    public testPassword = '';

    public encrypt(subject: string, _: string): string {
        return subject;
    }
}
