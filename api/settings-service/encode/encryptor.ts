export default interface Encryptor {
    encrypt(subject: string, password: string): string;
}
