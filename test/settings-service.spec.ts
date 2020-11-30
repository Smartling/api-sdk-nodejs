import sinon from "sinon";
import assert from "assert";
import { SmartlingSettingsServiceApi } from "../api/settings-service";
import { SettingsPayload } from "../api/settings-service/parameters/settings-payload";
import NoOpCodec from "../api/settings-service/encode/no-op-codec";
import AesCodec from "../api/settings-service/encode/aes-codec";

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
        it('should alter secrets if codec present', async () => {
            settingsServiceApi.setSecretsCodec(new NoOpCodec());
            const name = 'test';
            const createParams: SettingsPayload = new SettingsPayload(name);
            createParams.setSecrets({test: true});

            await settingsServiceApi.createProjectLevelSettings("testProjectId", "testIntegrationId", createParams);

            sinon.assert.calledOnce(settingsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                settingsServiceApiFetchStub,
                "https://test.com/connectors-settings-api/v2/projects/testProjectId/integrations/testIntegrationId/settings",
                {
                    body: `{"name":"${name}","secrets":{"encodedWith":"NoOpCodec","value":"{\\"test\\":true}"}}`,
                    headers: {
                        "Authorization": "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });
        it('should not alter empty secrets even if codec present', async () => {
            settingsServiceApi.setSecretsCodec(new NoOpCodec());
            const name = 'test';
            const createParams: SettingsPayload = new SettingsPayload(name);
            createParams.setSettings({test: true});
            await settingsServiceApi.createProjectLevelSettings("testProjectId", "testIntegrationId", createParams);

            sinon.assert.calledOnce(settingsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                settingsServiceApiFetchStub,
                "https://test.com/connectors-settings-api/v2/projects/testProjectId/integrations/testIntegrationId/settings",
                {
                    body: `{"name":"${name}","settings":{"test":true}}`,
                    headers: {
                        "Authorization": "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });
        it('should return unwrapped secrets if codec present on decoding', async () => {
            settingsServiceApi.setSecretsCodec(new NoOpCodec());
            const secret = "value";
            responseMockJsonStub.returns({
                response: {data: {created: new Date().toString(), secrets: {encodedWith: "NoOpCodec", value: JSON.stringify({secret: secret})}}}
            });
            assert.strictEqual((await settingsServiceApi.getProjectLevelSettings("testProjectId", "testIntegrationId")).secrets.secret, secret);
        });
    });
});

describe("Codec tests", () => {
    it('should encrypt with AES codec', function () {
        const x = new AesCodec('12345678901234567890123456789012');
        const secret = {test: true};
        const encoded = x.encode(secret);
        assert.strictEqual(encoded.encodedWith, x.getName());
        assert.match(encoded.value, /[0-9a-f]{32}:[0-9a-f]{32}/, 'Aes encrypted value should consist of initiation vector (16 bytes hex representation), literal \':\', and hex representation of encrypted string');
        // example: daf4b056f069e4804d9d7e199c88b089:d8db1d3f5b9284155113d17caeecea50
        //          ^ IV                             ^ encrypted secret
        assert.deepEqual(x.decode(encoded), secret);
    });

    it('should change secret structure with NoOp codec', function () {
        const x = new NoOpCodec();
        const secret = {test: true};
        const encoded = x.encode(secret);
        assert.deepEqual(encoded, {encodedWith: x.getName(), value: JSON.stringify(secret)});
        assert.deepEqual(x.decode(encoded), secret);
    });
});
