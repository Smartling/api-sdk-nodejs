import { SmartlingApiClientBuilder } from "../api/builder";
import { SmartlingLogApi } from "../api/log/index";
import { CreateLogParameters } from "../api/log/params/create-log-parameters";
import { LevelEnum } from "../api/log/params/level-enum";

const logger = console;

const baseUrl = "https://api.smartling.com";
const smartlingLogApi = new SmartlingApiClientBuilder()
    .withLogger(logger)
    .setBaseSmartlingApiUrl(baseUrl)
    .setClientLibMetadata("example-lib-name", "example-lib-version")
    .setHttpClientConfiguration({
        timeout: 10000
    })
    .build(SmartlingLogApi);

const payload: CreateLogParameters = new CreateLogParameters();

payload
    .addLogRecord("Test 1", { foo: "bar 1" }, LevelEnum.INFO, "TEST_CHANNEL", new Date())
    .addLogRecord("Test 2", { foo: "bar 2" }, LevelEnum.INFO, "TEST_CHANNEL", new Date());

(async () => {
    try {
        await smartlingLogApi.log(payload);
    } catch (e) {
        console.warn(e);
    }
})();
