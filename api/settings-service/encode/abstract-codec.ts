import Codec from "./codec";
import EncodedSecrets from "./encoded-secrets";
import EncryptionError from "../errors/encryption-error";

export default abstract class AbstractCodec implements Codec {
    public assertCanDecode(secret: EncodedSecrets) {
        if (secret.encodedWith !== this.getName()) {
            throw new EncryptionError(`Trying to decode an object encoded with ${secret.encodedWith} by ${this.getName()} codec`);
        }
    }

    public decode<TSecrets>(secrets: EncodedSecrets): TSecrets {
        this.assertCanDecode(secrets);
        try {
            return JSON.parse(this.decrypt(secrets.value));
        } catch (e) {
            throw new EncryptionError('Unable to parse secrets object after decoding', e);
        }
    }

    abstract decrypt(subject: string): string;

    public encode(secrets: any): EncodedSecrets {
        return {
            encodedWith: this.getName(),
            value: this.encrypt(JSON.stringify(secrets)),
        }
    }

    abstract encrypt(subject: string): string;

    public getName(): string {
        return this.constructor.name;
    }
}
