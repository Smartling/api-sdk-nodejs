import "mocha"
import sinon from "sinon";
import assert from "assert";
import {SmartlingPropertyMappingsApi} from "../api/property-mappings";
import {PropertyMappingParameters} from "../api/property-mappings/parameters/property-mapping-parameters";

const {loggerMock, authMock, responseMock} = require("./mock");

const property = {key: "key", value: "value"};
const mapping = {name: "anyMapping"};
const expectedBodyParams = `{"property":{"key":"key","value":"value"},"mapping":{"name":"anyMapping"}}`;

describe("SmartlingPropertyMappingsApi class tests.", () => {
	let propertyMappingsApi: SmartlingPropertyMappingsApi;
	let propertyMappingsServiceApiFetchStub;
	let propertyMappingsServiceApiUaStub;
	let responseMockJsonStub;
	let propertyMappingsParameters: PropertyMappingParameters;

	beforeEach(() => {
		propertyMappingsParameters = new PropertyMappingParameters()
			.setMapping(mapping)
			.setProperty(property);

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
			assert.deepEqual(
				{
					mapping: mapping,
					property: property
				},
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
					body: expectedBodyParams,
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
			const propertyParam = JSON.stringify(property);
			const params = new PropertyMappingParameters(propertyParam);
			await propertyMappingsApi.searchProjectPropertyMappings(
				"testProjectId",
				"testIntegrationId",
				params
			);

			sinon.assert.calledOnce(propertyMappingsServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				propertyMappingsServiceApiFetchStub,
				`https://test.com/connectors-property-mappings-api/v2/projects/testProjectId/integrations/testIntegrationId/property-mappings?property=${encodeURIComponent(propertyParam)}`,
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
					body: expectedBodyParams,
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
					body: expectedBodyParams,
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
			const propertyParam = JSON.stringify(property);
			const params = new PropertyMappingParameters(propertyParam);
			await propertyMappingsApi.searchAccountPropertyMappings(
				"testAccountUid",
				"testIntegrationId",
				params
			);

			sinon.assert.calledOnce(propertyMappingsServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				propertyMappingsServiceApiFetchStub,
				`https://test.com/connectors-property-mappings-api/v2/accounts/testAccountUid/integrations/testIntegrationId/property-mappings?property=${encodeURIComponent(propertyParam)}`,
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
					body: expectedBodyParams,
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
