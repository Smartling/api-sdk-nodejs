import { SmartlingAuthApi } from "./index";
import { AccessTokenDto } from "./dto/access-token-dto";

export class AccessTokenProvider extends SmartlingAuthApi {
    constructor(
        accessToken: string,
        tokenType: string,
    ) {
        super(null, null, null, null);

        this.response = {
            accessToken,
            tokenType,
            expiresIn: Number.MAX_SAFE_INTEGER,
            refreshToken: "",
            refreshExpiresIn: Number.MAX_SAFE_INTEGER
        } as AccessTokenDto;
    }

    async authenticate(): Promise<AccessTokenDto> {
        return this.response;
    }

    async refreshToken(): Promise<AccessTokenDto> {
        return this.response;
    }

    tokenExists(): boolean {
        return !!this.response?.accessToken;
    }

    tokenExpired(): boolean {
        return false;
    }

    tokenCanBeRenewed(): boolean {
        return false;
    }
}
