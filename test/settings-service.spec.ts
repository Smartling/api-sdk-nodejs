import sinon from "sinon";
import assert from "assert";
import { SmartlingSettingsServiceApi } from "../api/settings-service";
import { SettingsPayload } from "../api/settings-service/parameters/settings-payload";
import SecretsCodec from "../api/settings-service/encode/secrets-codec";
import NoOpDecryptor from "../api/settings-service/encode/no-op-decryptor";
import AesEncryptor from "../api/settings-service/encode/aes-encryptor";
import EncryptionError from "../api/settings-service/errors/encryption-error";

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

            await settingsServiceApi.createProjectLevelSettings("testProjectId", "testIntegrationId", createParams);

            sinon.assert.calledOnce(settingsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                settingsServiceApiFetchStub,
                "https://test.com/connectors-settings-api/v2/projects/testProjectId/integrations/testIntegrationId/settings",
                {
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
        it("Should delete project level settings", async () => {
            await settingsServiceApi.deleteProjectLevelSettings("testProjectId", "testIntegrationId");

            sinon.assert.calledOnce(settingsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                settingsServiceApiFetchStub,
                "https://test.com/connectors-settings-api/v2/projects/testProjectId/integrations/testIntegrationId/settings",
                {
                    headers: {
                        "Authorization": "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "delete"
                }
            );
        });
        it("Should get project level settings", async () => {
            await settingsServiceApi.getProjectLevelSettings("testProjectId", "testIntegrationId");

            sinon.assert.calledOnce(settingsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                settingsServiceApiFetchStub,
                "https://test.com/connectors-settings-api/v2/projects/testProjectId/integrations/testIntegrationId/settings", {
                    headers: {
                        "Authorization": "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });
        it("Should update project level settings", async () => {
            const name = "test";
            await settingsServiceApi.updateProjectLevelSettings(
                "testProjectId",
                "testIntegrationId",
                new SettingsPayload(name)
            );

            sinon.assert.calledOnce(settingsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                settingsServiceApiFetchStub,
                "https://test.com/connectors-settings-api/v2/projects/testProjectId/integrations/testIntegrationId/settings",
                {
                    body: `{"name":"${name}"}`,
                    headers: {
                        "Authorization": "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put"
                }
            );
        });
    });

    describe("Encryption", () => {
        it('should not allow codec creation with wrong decoder and encoder pair', () => {
            assert.throws(() => {settingsServiceApi.setSecretsCodec(new SecretsCodec(new NoOpDecryptor(), new AesEncryptor(), '12345678901234567890123456789012'))}, EncryptionError);
        });
        it('should alter secrets if codec present', async () => {
            settingsServiceApi.setSecretsCodec(new SecretsCodec());
            const name = 'test';
            const createParams: SettingsPayload = new SettingsPayload(name);
            createParams.setSecrets({test: true});

            await settingsServiceApi.createProjectLevelSettings("testProjectId", "testIntegrationId", createParams);

            sinon.assert.calledOnce(settingsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                settingsServiceApiFetchStub,
                "https://test.com/connectors-settings-api/v2/projects/testProjectId/integrations/testIntegrationId/settings",
                {
                    body: `{"name":"${name}","secrets":{"encodedWith":"NoOpEncryptor","value":"{\\"test\\":true}"}}`,
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
