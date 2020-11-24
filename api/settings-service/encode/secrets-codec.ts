import Codec from "./codec";
import Decryptor from "./decryptor";
import EncodedSecrets from "./encoded-secrets";
import Encryptor from "./encryptor";
import NoOpDecryptor from "./no-op-decryptor";
import NoOpEncryptor from "./no-op-encryptor";
import { randomBytes } from "crypto";

export default class SecretsCodec implements Codec {
    private readonly decryptor: Decryptor;
    private readonly encryptor: Encryptor;
    public password: string;

    constructor(decryptor: Decryptor = new NoOpDecryptor(), encryptor: Encryptor = new NoOpEncryptor(), password: string = '') {
        this.decryptor = decryptor;
        this.encryptor = encryptor;
        this.password = password;
        this.assertDecryptAfterEncryptSuccess();
    }

    decode<TSecrets>(secrets: EncodedSecrets): TSecrets {
        return JSON.parse(this.decryptor.decrypt(secrets.value, this.password));
    }

    encode(secrets: any): EncodedSecrets {
        return {
            encodedWith: this.encryptor.constructor.name,
            value: this.encryptor.encrypt(JSON.stringify(secrets), this.password),
        }
    }

    public assertDecryptAfterEncryptSuccess() {
        const string = randomBytes(32).toString('hex');
        const encrypted = this.encryptor.encrypt(string, this.password);
        const decrypted = this.decryptor.decrypt(encrypted, this.password);
        if (string !== decrypted) {
            throw new Error('Strings differ after an encrypt-decrypt pass, check settings');
        }
    }
}
