import { AuthStorageProvider } from './storage-provider';
import { AccessTokenDto } from './dto/access-token-dto';

export class DefaultStorageProvider extends AuthStorageProvider {
    private tokenData: AccessTokenDto = null;

    constructor() {
        super();
    }
    async setTokenData(tokenData: AccessTokenDto) {
        this.tokenData = tokenData;
    }
    async getTokenData() {
        return this.tokenData;
    }
    async clearTokenData() {
        this.tokenData = null;
    }
}
