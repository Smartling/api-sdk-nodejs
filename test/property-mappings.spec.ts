import "mocha"
import sinon from "sinon";
import assert from "assert";
import {SmartlingPropertyMappingsApi} from "../api/property-mappings";
import BaseParameters from "../api/parameters";

const {loggerMock, authMock, responseMock} = require("./mock");

const propertyMappings = {key: "key", value: "value"};

describe("SmartlingPropertyMappingsApi class tests.", () => {
	let propertyMappingsApi: SmartlingPropertyMappingsApi;
	let propertyMappingsServiceApiFetchStub;
	let propertyMappingsServiceApiUaStub;
	let responseMockJsonStub;
	let propertyMappingsParameters: BaseParameters;

	beforeEach(() => {
		propertyMappingsParameters = new BaseParameters(propertyMappings);

		propertyMappingsApi = new SmartlingPropertyMappingsApi(authMock, loggerMock, "https://test.com");
		propertyMappingsServiceApiFetchStub = sinon.stub(propertyMappingsApi, "fetch");
		propertyMappingsServiceApiUaStub = sinon.stub(propertyMappingsApi, "ua");
		responseMockJsonStub = sinon.stub(responseMock, "json");

		propertyMappingsServiceApiUaStub.returns("test_user_agent");
		propertyMappingsServiceApiFetchStub.returns(responseMock);
		responseMockJsonStub.returns({
			response: {}
		});
	});

	afterEach(() => {
		propertyMappingsServiceApiFetchStub.restore();
		responseMockJsonStub.restore();
		propertyMappingsServiceApiUaStub.restore();
	});

	describe("Params", () => {
		it("Create property mapping parameters", () => {
			assert.deepEqual(propertyMappings,
				propertyMappingsParameters.export()
			);
		});
	});

	describe("Methods", () => {
		it("Should create project property mappings", async () => {
			await propertyMappingsApi.createProjectPropertyMapping("testProjectId", "testIntegrationId", propertyMappingsParameters);

			sinon.assert.calledOnce(propertyMappingsServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				propertyMappingsServiceApiFetchStub,
				"https://test.com/connectors-property-mappings-api/v2/projects/testProjectId/integrations/testIntegrationId/property-mappings",
				{
					body: `{"key":"key","value":"value"}`,
					headers: {
						"Authorization": "test_token_type test_access_token",
						"Content-Type": "application/json",
						"User-Agent": "test_user_agent"
					},
					method: "post"
				}
			);
		});

		it("Should get project property mappings", async () => {
			await propertyMappingsApi.getProjectPropertyMappings("testProjectId", "testIntegrationId");

			sinon.assert.calledOnce(propertyMappingsServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				propertyMappingsServiceApiFetchStub,
				"https://test.com/connectors-property-mappings-api/v2/projects/testProjectId/integrations/testIntegrationId/property-mappings", {
					headers: {
						"Authorization": "test_token_type test_access_token",
						"Content-Type": "application/json",
						"User-Agent": "test_user_agent"
					},
					method: "get"
				}
			);
		});
		it("Should search project property mappings", async () => {
			await propertyMappingsApi.searchProjectPropertyMappings(
				"testProjectId",
				"testIntegrationId",
				propertyMappingsParameters
			);

			sinon.assert.calledOnce(propertyMappingsServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				propertyMappingsServiceApiFetchStub,
				`https://test.com/connectors-property-mappings-api/v2/projects/testProjectId/integrations/testIntegrationId/property-mappings?property={"key":"key","value":"value"}`,
				{
					headers: {
						"Authorization": "test_token_type test_access_token",
						"Content-Type": "application/json",
						"User-Agent": "test_user_agent"
					},
					method: "get"
				}
			);
		});

		it("Should update project property mappings", async () => {
			await propertyMappingsApi.updateProjectPropertyMapping(
				"testProjectId",
				"testIntegrationId",
				"propertyMappingUid",
				propertyMappingsParameters
			);

			sinon.assert.calledOnce(propertyMappingsServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				propertyMappingsServiceApiFetchStub,
				"https://test.com/connectors-property-mappings-api/v2/projects/testProjectId/integrations/testIntegrationId/property-mappings/propertyMappingUid",
				{
					body: `{"key":"key","value":"value"}`,
					headers: {
						"Authorization": "test_token_type test_access_token",
						"Content-Type": "application/json",
						"User-Agent": "test_user_agent"
					},
					method: "put"
				}
			);
		});

		it("Should create account property mappings", async () => {
			await propertyMappingsApi.createAccountPropertyMapping("testAccountUid", "testIntegrationId", propertyMappingsParameters);

			sinon.assert.calledOnce(propertyMappingsServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				propertyMappingsServiceApiFetchStub,
				"https://test.com/connectors-property-mappings-api/v2/accounts/testAccountUid/integrations/testIntegrationId/property-mappings",
				{
					body: `{"key":"key","value":"value"}`,
					headers: {
						"Authorization": "test_token_type test_access_token",
						"Content-Type": "application/json",
						"User-Agent": "test_user_agent"
					},
					method: "post"
				}
			);
		});

		it("Should get account property mappings", async () => {
			await propertyMappingsApi.getAccountPropertyMappings("testAccountUid", "testIntegrationId");

			sinon.assert.calledOnce(propertyMappingsServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				propertyMappingsServiceApiFetchStub,
				"https://test.com/connectors-property-mappings-api/v2/accounts/testAccountUid/integrations/testIntegrationId/property-mappings", {
					headers: {
						"Authorization": "test_token_type test_access_token",
						"Content-Type": "application/json",
						"User-Agent": "test_user_agent"
					},
					method: "get"
				}
			);
		});
		it("Should search account property mappings", async () => {
			await propertyMappingsApi.searchAccountPropertyMappings(
				"testAccountUid",
				"testIntegrationId",
				propertyMappingsParameters
			);

			sinon.assert.calledOnce(propertyMappingsServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				propertyMappingsServiceApiFetchStub,
				`https://test.com/connectors-property-mappings-api/v2/accounts/testAccountUid/integrations/testIntegrationId/property-mappings?property={"key":"key","value":"value"}`,
				{
					headers: {
						"Authorization": "test_token_type test_access_token",
						"Content-Type": "application/json",
						"User-Agent": "test_user_agent"
					},
					method: "get"
				}
			);
		});

		it("Should update account property mappings", async () => {
			await propertyMappingsApi.updateAccountPropertyMapping(
				"testAccountUid",
				"testIntegrationId",
				"propertyMappingUid",
				propertyMappingsParameters
			);

			sinon.assert.calledOnce(propertyMappingsServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				propertyMappingsServiceApiFetchStub,
				"https://test.com/connectors-property-mappings-api/v2/accounts/testAccountUid/integrations/testIntegrationId/property-mappings/propertyMappingUid",
				{
					body: `{"key":"key","value":"value"}`,
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
});
