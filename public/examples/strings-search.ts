import SmartlingSearchStringsApi from "../api/strings-search";
import { SmartlingApiClientBuilder } from "../api/builder";
import {HTTPResponse} from "../api/http/response";
import {StringDataDto} from "../api/strings-search/dto/string-data-dto";

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const baseUrl = "https://api.smartling.com";
    const smartlingSearchStringsApi = new SmartlingApiClientBuilder()
        .setLogger(logger)
        .setBaseSmartlingApiUrl(baseUrl)
        .setClientLibMetadata("example-lib-name", "example-lib-version")
        .setHttpClientConfiguration({
            timeout: 10000
        })
        .authWithUserIdAndUserSecret(userId, userSecret)
        .build(SmartlingSearchStringsApi);

    (async () => {
        try {
            const result: HTTPResponse<StringDataDto> = await smartlingSearchStringsApi.getStringsData(projectId, ["test1", "test2"]);

            logger.debug(JSON.stringify(result, null, 2));
        } catch (e) {
            logger.error(e);
        }
    })();
}
