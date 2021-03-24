import "mocha"
import sinon from "sinon";
import assert from "assert";
import {SmartlingContextApi} from "../api/context";
import {ContextAutomaticMatchParameters} from "../api/context/params/context-automatic-match-parameters";

const {loggerMock, authMock, responseMock} = require("./mock");

const projectId = "testProjectId";
const contextUid = "testContextUid";
const fileName = "testContextFileName";

const stringHashCodes = ["testStringHashCode1", "testStringHashCode2"];
const expectedAutomaticMatchParams = {
	overrideContextOlderThanDays: 1,
	contentFileUri: fileName,
	stringHashcodes: stringHashCodes
};

describe("SmartlingContextApi class tests.", () => {
	let contextApi: SmartlingContextApi;
	let contextAutomaticMatchParameters: ContextAutomaticMatchParameters;
	let contextServiceApiFetchStub;
	let contextServiceApiUaStub;
	let responseMockJsonStub;

	beforeEach(() => {
		contextAutomaticMatchParameters = new ContextAutomaticMatchParameters();
		contextAutomaticMatchParameters
			.setStringHashcodes(stringHashCodes)
			.setFileUri(fileName)
			.setOverrideContextOlderThanDays(1);

		contextApi = new SmartlingContextApi(authMock, loggerMock, "https://test.com");
		contextServiceApiFetchStub = sinon.stub(contextApi, "fetch");
		contextServiceApiUaStub = sinon.stub(contextApi, "ua");
		responseMockJsonStub = sinon.stub(responseMock, "json");

		contextServiceApiUaStub.returns("test_user_agent");
		contextServiceApiFetchStub.returns(responseMock);
		responseMockJsonStub.returns({
			response: {}
		});
	});

	afterEach(() => {
		contextServiceApiFetchStub.restore();
		responseMockJsonStub.restore();
		contextServiceApiUaStub.restore();
	});

	describe("Params", () => {
		it("Run automatic match parameters", () => {
			assert.deepEqual(
				expectedAutomaticMatchParams,
				contextAutomaticMatchParameters.export()
			);
		});
	});

	describe("Methods", () => {
		it("Should run automatic matching", async () => {
			await contextApi.runAutomaticMatch(projectId, contextUid, contextAutomaticMatchParameters);

			sinon.assert.calledOnce(contextServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				contextServiceApiFetchStub,
				`https://test.com/context-api/v2/projects/${projectId}/contexts/${contextUid}/match/async`,
				{
					body: expectedAutomaticMatchParams,
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
