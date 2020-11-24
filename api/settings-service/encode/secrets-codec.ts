import Codec from "./codec";
import Decryptor from "./decryptor";
import EncodedSecrets from "./encoded-secrets";
import EncryptionError from "../errors/encryption-error";
import Encryptor from "./encryptor";
import NoOpDecryptor from "./no-op-decryptor";
import NoOpEncryptor from "./no-op-encryptor";

export default class SecretsCodec implements Codec {
    private readonly decryptor: Decryptor;
    private readonly encryptor: Encryptor;
    public password: string;

    constructor(decryptor: Decryptor = new NoOpDecryptor(), encryptor: Encryptor = new NoOpEncryptor(), password: string = '') {
        this.decryptor = decryptor;
        this.encryptor = encryptor;
        this.password = password;
    }

    decode<TSecrets>(secrets: EncodedSecrets): TSecrets {
        try {
            return JSON.parse(this.decryptor.decrypt(secrets.value, this.password));
        } catch (e) {
            throw new EncryptionError('Unable to parse secrets object after decoding', e);
        }
    }

    encode(secrets: any): EncodedSecrets {
        return {
            encodedWith: this.encryptor.constructor.name,
            value: this.encryptor.encrypt(JSON.stringify(secrets), this.password),
        }
    }
}
