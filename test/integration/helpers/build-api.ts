import { SmartlingApiClientBuilder } from "../../../api/builder/index";
import { SmartlingBaseApi } from "../../../api/base/index";
import { AccessTokenProvider } from "../../../api/auth/access-token-provider";
import { Logger } from "../../../api/logger";

export function buildApi<T extends SmartlingBaseApi>(
    apiClass: new (baseUrl: string, authApi: AccessTokenProvider, logger: Logger) => T
): T {
    return new SmartlingApiClientBuilder()
        .setBaseSmartlingApiUrl(process.env.SMARTLING_API_BASE_URL || "https://api.smartling.com")
        .authWithUserIdAndUserSecret(
            process.env.SMARTLING_USER_ID as string,
            process.env.SMARTLING_USER_SECRET as string
        )
        .build(apiClass);
}
