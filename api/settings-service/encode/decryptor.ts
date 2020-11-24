export default interface Decryptor {
    decrypt(subject: string, password: string): string;
}
