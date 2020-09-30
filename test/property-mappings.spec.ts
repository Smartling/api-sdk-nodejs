import "mocha"
import sinon from "sinon";
import assert from "assert";
import {ActionEnum} from "../api/property-mappings/params/action-enum";
import {PropertyParameters} from "../api/property-mappings/params/property-parameters";
import {MappingParameters} from "../api/property-mappings/params/mapping-parameters";
import {PropertyMappingsParameters} from "../api/property-mappings/params/property-mappings-parameters";
import {SmartlingPropertyMappingsApi} from "../api/property-mappings";

const {loggerMock, authMock, responseMock} = require("./mock");

const contentType = "contactPage";
const name = "title";
const space = "q2fjg5qulqq8";

describe("SmartlingPropertyMappingsApi class tests.", () => {
	let propertyMappingsApi: SmartlingPropertyMappingsApi;
	let propertyMappingsServiceApiFetchStub;
	let propertyMappingsServiceApiUaStub;
	let responseMockJsonStub;
	let propertyMappingsParameters: PropertyMappingsParameters;

	beforeEach(() => {
		const propertyParameters: PropertyParameters = (new PropertyParameters())
			.setContentType(contentType)
			.setName(name)
			.setSpace(space);
		const mappingParameters: MappingParameters = (new MappingParameters())
			.setAction(ActionEnum.TRANSLATE);
		propertyMappingsParameters = (new PropertyMappingsParameters())
			.setMapping(mappingParameters)
			.setProperty(propertyParameters);

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
			assert.deepEqual({
					"property": {
						"space": space,
						"contentType": contentType,
						"name": name
					},
					"mapping": {
						"action": ActionEnum.TRANSLATE
					}
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
					body: `{"mapping":{"action":"${ActionEnum.TRANSLATE}"},"property":{"contentType":"${contentType}","name":"${name}","space":"${space}"}}`,
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
			const propertyParameters: PropertyParameters = (new PropertyParameters())
				.setContentType(contentType)
				.setSpace(space);

			await propertyMappingsApi.searchProjectPropertyMappings(
				"testProjectId",
				"testIntegrationId",
				propertyParameters
			);

			sinon.assert.calledOnce(propertyMappingsServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				propertyMappingsServiceApiFetchStub,
				`https://test.com/connectors-property-mappings-api/v2/projects/testProjectId/integrations/testIntegrationId/property-mappings?property={"contentType":"${contentType}","space":"${space}"}`,
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
	});
});
