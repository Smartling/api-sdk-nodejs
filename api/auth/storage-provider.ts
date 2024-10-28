import { AccessTokenDto } from './dto/access-token-dto';

export abstract class AuthStorageProvider {
    public abstract setTokenData(tokenData: AccessTokenDto): Promise<void>;

    public abstract getTokenData(): Promise<Partial<AccessTokenDto>>;

    public abstract clearTokenData(): Promise<void>;
}
