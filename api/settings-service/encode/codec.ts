import EncodedSecrets from "./encoded-secrets";

export default interface Codec {
    decode<TSecrets>(secrets: EncodedSecrets): TSecrets;
    encode(secrets: any): EncodedSecrets;
    getName(): string;
}
