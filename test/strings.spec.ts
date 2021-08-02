import "mocha"
import sinon from "sinon";
import assert from "assert";
import { SmartlingStringsApi } from "../api/strings";
import { FetchSourceStringsParameters } from "../api/strings/params/fetch-source-strings-parameters";
import { loggerMock, authMock, responseMock } from "./mock";

const projectId = "testProjectId";
const fileUri = "testStringsFileUri";
const limit = 25;
const offset = 0;

const hashCodes = ["testStringHashCode1", "testStringHashCode2"];
const hashCodesParams = hashCodes.map(hashCode => `hashcodes=${hashCode}`).join('&')
const expectedFetchSourceStringsParams = `${hashCodesParams}&fileUri=${fileUri}&limit=${limit}&offset=${offset}`;

describe("SmartlingStringsApi class tests.", () => {
    let stringsApi: SmartlingStringsApi;
    let fetchSourceStringsParameters: FetchSourceStringsParameters;
    let stringsServiceApiFetchStub;
    let stringsServiceApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        fetchSourceStringsParameters = new FetchSourceStringsParameters();
        fetchSourceStringsParameters
            .setHashCodes(hashCodes)
            .setFileUri(fileUri)
            .setLimit(limit)
            .setOffset(offset);

        stringsApi = new SmartlingStringsApi(authMock as any, loggerMock, "https://test.com");
        stringsServiceApiFetchStub = sinon.stub(stringsApi, "fetch");
        stringsServiceApiUaStub = sinon.stub(stringsApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        stringsServiceApiUaStub.returns("test_user_agent");
        stringsServiceApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        stringsServiceApiFetchStub.restore();
        responseMockJsonStub.restore();
        stringsServiceApiUaStub.restore();
    });

    describe("Params", () => {
        it("Fetch source strings parameters", () => {
            assert.deepEqual(
                {
                    fileUri: fileUri,
                    hashcodes: hashCodes,
                    limit: limit,
                    offset: offset
                },
                fetchSourceStringsParameters.export()
            );
        });
    });

    describe("Methods", () => {
        it("Fetch source strings", async () => {
            await stringsApi.getSourceStrings(projectId, fetchSourceStringsParameters);

            sinon.assert.calledOnce(stringsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                stringsServiceApiFetchStub,
                `https://test.com/strings-api/v2/projects/${projectId}/source-strings?${expectedFetchSourceStringsParams}`,
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
