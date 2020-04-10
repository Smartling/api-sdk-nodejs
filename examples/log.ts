import { SmartlingApiFactory } from "../api/factory/index";
import { SmartlingLogApi } from "../api/log/index";
import { CreateLogParameters } from "../api/log/params/create-log-parameters";
import { LevelEnum } from "../api/log/params/level-enum";

const logger = console;

const baseUrl = "https://api.smartling.com";
const apiFactory = new SmartlingApiFactory(null, null, baseUrl, logger);
const smartlingLogApi = apiFactory.createApiClient(SmartlingLogApi, { timeout: 10000 });

smartlingLogApi.clientLibId = "testClientLibId";
smartlingLogApi.clientLibVersion = "testClientLibVersion";

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
