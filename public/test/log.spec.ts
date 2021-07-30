import sinon from "sinon";
import fs from "fs";
import assert from "assert";
import { SmartlingLogApi } from "../api/log/index";
import { CreateLogParameters } from "../api/log/params/create-log-parameters";
import { LevelEnum } from "../api/log/params/level-enum";

const { loggerMock, responseMock } = require("./mock");

describe("SmartlingAuditLogApi class tests.", () => {
    let logApi;
    let logApiFetchStub;
    let logApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        logApi = new SmartlingLogApi(null, loggerMock, "https://test.com");

        logApiFetchStub = sinon.stub(logApi, "fetch");
        logApiUaStub = sinon.stub(logApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        logApiUaStub.returns("test_user_agent");
        logApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            code: "SUCCESS",
            data: null
        });
    });

    afterEach(() => {
        logApiFetchStub.restore();
        responseMockJsonStub.restore();
        logApiUaStub.restore();
    });

    it("Create log record", async () => {
        const createParams: CreateLogParameters = new CreateLogParameters();

        createParams
            .addLogRecord("Test 1", { foo: "bar 1" }, LevelEnum.INFO, "TEST_CHANNEL", new Date("2020-10-10T00:00:00Z"))
            .addLogRecord("Test 2", { foo: "bar 2" }, LevelEnum.INFO, "TEST_CHANNEL", new Date("2020-10-10T00:00:00Z"));

        await logApi.log(createParams);

        sinon.assert.calledOnce(logApiFetchStub);
        sinon.assert.calledWithExactly(
            logApiFetchStub,
            "https://test.com/updates/status", {
                body: "{\"records\":[{\"message\":\"Test 1\",\"context\":{\"foo\":\"bar 1\"},\"level_name\":\"info\",\"channel\":\"TEST_CHANNEL\",\"datetime\":\"2020-10-10T00:00:00.000Z\"},{\"message\":\"Test 2\",\"context\":{\"foo\":\"bar 2\"},\"level_name\":\"info\",\"channel\":\"TEST_CHANNEL\",\"datetime\":\"2020-10-10T00:00:00.000Z\"}]}",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                },
                method: "post"
            }
        );
    });
});
