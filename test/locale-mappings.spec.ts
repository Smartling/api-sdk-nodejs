import sinon from "sinon";
import { SmartlingLocaleMappingsApi } from "../api/locale-mappings/index";
import { SmartlingAuthApi } from "../api/auth/index";
import { LocaleMappingParameters } from "../api/locale-mappings/params/locale-mapping-parameters";
import { ListLocaleMappingsParameters } from "../api/locale-mappings/params/list-locale-mappings-parameters";
import { loggerMock, authMock, responseMock } from "./mock";

describe("SmartlingLocaleMappingsApi class tests.", () => {
    let localeMappingsApi;
    let fetchStub;
    let uaStub;
    let responseMockTextStub;

    const headers = {
        Authorization: "test_token_type test_access_token",
        "Content-Type": "application/json",
        "User-Agent": "test_user_agent"
    };
    const mappingParams = () => new LocaleMappingParameters()
        .setExternalLocaleId("zh-hans")
        .setExternalLocaleDescription("Custom Chinese")
        .setExternalLocaleMetadata({ path: "/content/chinese" })
        .setSmartlingLocaleId("zh");
    const mappingBody = JSON.stringify({
        externalLocaleId: "zh-hans",
        externalLocaleDescription: "Custom Chinese",
        externalLocaleMetadata: { path: "/content/chinese" },
        smartlingLocaleId: "zh"
    });

    beforeEach(() => {
        localeMappingsApi = new SmartlingLocaleMappingsApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);
        fetchStub = sinon.stub(localeMappingsApi, "fetch");
        uaStub = sinon.stub(localeMappingsApi, "ua");
        responseMockTextStub = sinon.stub(responseMock, "text");

        uaStub.returns("test_user_agent");
        fetchStub.returns(responseMock);
        responseMockTextStub.returns("{\"response\": {\"data\": {}}}");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("Create mapping for account", async () => {
        await localeMappingsApi.createMappingForAccount("test_account", mappingParams());

        sinon.assert.calledOnce(fetchStub);
        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/accounts/test_account/locale-mappings",
            { method: "post", headers, body: mappingBody }
        );
    });

    it("Create mapping for account and integration", async () => {
        await localeMappingsApi.createMappingForAccount("test_account", mappingParams(), "helpshift");

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/accounts/test_account/integrations/helpshift/locale-mappings",
            { method: "post", headers, body: mappingBody }
        );
    });

    it("Create mapping encodes integration id", async () => {
        await localeMappingsApi.createMappingForProject("test_project", mappingParams(), "a/b?c");

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/projects/test_project/integrations/a%2Fb%3Fc/locale-mappings",
            { method: "post", headers, body: mappingBody }
        );
    });

    it("Create mapping for project", async () => {
        await localeMappingsApi.createMappingForProject("test_project", mappingParams());

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/projects/test_project/locale-mappings",
            { method: "post", headers, body: mappingBody }
        );
    });

    it("Create mapping for project and integration", async () => {
        await localeMappingsApi.createMappingForProject("test_project", mappingParams(), "helpshift");

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/projects/test_project/integrations/helpshift/locale-mappings",
            { method: "post", headers, body: mappingBody }
        );
    });

    it("Update mapping for account", async () => {
        await localeMappingsApi.updateMappingForAccount("test_account", "test_uid", mappingParams());

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/accounts/test_account/locale-mappings/test_uid",
            { method: "put", headers, body: mappingBody }
        );
    });

    it("Update mapping for project", async () => {
        await localeMappingsApi.updateMappingForProject("test_project", "test_uid", mappingParams());

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/projects/test_project/locale-mappings/test_uid",
            { method: "put", headers, body: mappingBody }
        );
    });

    it("Delete mapping for account", async () => {
        await localeMappingsApi.deleteMappingForAccount("test_account", "test_uid");

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/accounts/test_account/locale-mappings/test_uid",
            { method: "delete", headers }
        );
    });

    it("Delete mapping for project", async () => {
        await localeMappingsApi.deleteMappingForProject("test_project", "test_uid");

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/projects/test_project/locale-mappings/test_uid",
            { method: "delete", headers }
        );
    });

    it("Get mapping for account", async () => {
        await localeMappingsApi.getMappingForAccount("test_account", "test_uid");

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/accounts/test_account/locale-mappings/test_uid",
            { method: "get", headers }
        );
    });

    it("Get mapping for project", async () => {
        await localeMappingsApi.getMappingForProject("test_project", "test_uid");

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/projects/test_project/locale-mappings/test_uid",
            { method: "get", headers }
        );
    });

    it("List mappings for account", async () => {
        await localeMappingsApi.listMappingsForAccount("test_account");

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/accounts/test_account/locale-mappings",
            { method: "get", headers }
        );
    });

    it("List mappings for project with params", async () => {
        const params = new ListLocaleMappingsParameters()
            .setOffset(5)
            .setLimit(20)
            .setSortBy("modified")
            .setOrderBy("asc")
            .setIntegrationId("helpshift");

        await localeMappingsApi.listMappingsForProject("test_project", params);

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/locale-mappings-api/v2/projects/test_project/locale-mappings?offset=5&limit=20&sortBy=modified&orderBy=asc&integrationId=helpshift",
            { method: "get", headers }
        );
    });
});
