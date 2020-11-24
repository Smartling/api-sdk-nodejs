import Encryptor from "./encryptor";

export default class NoOpEncryptor implements Encryptor {
    public encrypt(subject: string, _: string): string {
        return subject;
    }
}
