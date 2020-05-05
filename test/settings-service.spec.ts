import sinon from "sinon";
import assert from "assert";
import { SmartlingSettingsServiceApi } from "../api/settings-service";
import { SettingsPayload } from "../api/settings-service/parameters/settings-payload";

const {loggerMock, authMock, responseMock} = require("./mock");

describe("SmartlingSettingsServiceApi class tests.", () => {
    let settingsServiceApi;
    let settingsServiceApiFetchStub;
    let settingsServiceApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        settingsServiceApi = new SmartlingSettingsServiceApi(authMock, loggerMock, "https://test.com");
        settingsServiceApiFetchStub = sinon.stub(settingsServiceApi, "fetch");
        settingsServiceApiUaStub = sinon.stub(settingsServiceApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        settingsServiceApiUaStub.returns("test_user_agent");
        settingsServiceApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        settingsServiceApiFetchStub.restore();
        responseMockJsonStub.restore();
        settingsServiceApiUaStub.restore();
    });

    describe("Params", () => {
        it("Create settings parameters", () => {
            const createParams: SettingsPayload = new SettingsPayload("test");

            createParams
                .setSecrets({"testSecret": "testSecretValue"})
                .setSettings({"testSetting": "testSettingValue"})

            assert.deepEqual(
                {
                    name: "test",
                    secrets: {"testSecret": "testSecretValue"},
                    settings: {"testSetting": "testSettingValue"},
                },
                createParams.export()
            );
        });
    });

    describe("Methods", () => {
        it("Should create project level settings", async () => {
            const name = "test";
            const secrets = {"secretKey": "secretValue"};
            const settings = {"setting": "value"};
            const createParams: SettingsPayload = new SettingsPayload(name);
            createParams.setSecrets(secrets);
            createParams.setSettings(settings);

            settingsServiceApiFetchStub.returns(':)');

            const result = await settingsServiceApi.createProjectLevelSettings("testProjectId", "testIntegrationId", createParams);

            sinon.assert.calledOnce(settingsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                settingsServiceApiFetchStub,
                "https://test.com/connectors-settings-service-api/v2/projects/testProjectId/integrations/testIntegrationId/settings", {
                    body: `{"name":"${name}","secrets":{"secretKey":"secretValue"},"settings":{"setting":"value"}}`,
                    headers: {
                        "Authorization": "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });
    });
});
