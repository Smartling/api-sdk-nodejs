import EncodedSecrets from "./encoded-secrets";

export default interface Codec {
    password: string;
    decode<TSecrets>(secrets: EncodedSecrets): TSecrets
    encode(secrets: any): EncodedSecrets
}
