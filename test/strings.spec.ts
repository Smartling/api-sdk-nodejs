import sinon from "sinon";
import assert from "assert";
import { SmartlingStringsApi } from "../api/strings/index";
import { FetchSourceStringsParameters } from "../api/strings/params/fetch-source-strings-parameters";
import { CreateStringsParameters } from "../api/strings/params/create-strings-parameters";
import { StringItemParameters } from "../api/strings/params/string-item-parameters";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingAuthApi } from "../api/auth/index";

describe("SmartlingStringsApi class tests.", () => {
    const projectId = "testProjectId";
    const testProcessUid = "test-process-uid";
    const fileUri = "testStringsFileUri";
    const limit = 25;
    const offset = 0;
    const hashCodes = ["testStringHashCode1", "testStringHashCode2"];
    const hashCodesParams = hashCodes.map((hashCode) => `hashcodes=${hashCode}`).join("&");
    const expectedFetchSourceStringsParams = `${hashCodesParams}&fileUri=${fileUri}&limit=${limit}&offset=${offset}`;
    let stringsApi: SmartlingStringsApi;
    let fetchSourceStringsParameters: FetchSourceStringsParameters;
    let stringsServiceApiFetchStub;
    let stringsServiceApiUaStub;
    let responseMockJsonStub;
    let responseMockTextStub;

    beforeEach(() => {
        fetchSourceStringsParameters = new FetchSourceStringsParameters();
        fetchSourceStringsParameters
            .setHashCodes(hashCodes)
            .setFileUri(fileUri)
            .setLimit(limit)
            .setOffset(offset);

        stringsApi = new SmartlingStringsApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);
        stringsServiceApiFetchStub = sinon.stub(stringsApi, "fetch");
        stringsServiceApiUaStub = sinon.stub(stringsApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");
        responseMockTextStub = sinon.stub(responseMock, "text");

        stringsServiceApiUaStub.returns("test_user_agent");
        stringsServiceApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
        responseMockTextStub.returns("{\"response\": {}}");
    });

    afterEach(() => {
        stringsServiceApiFetchStub.restore();
        responseMockJsonStub.restore();
        responseMockTextStub.restore();
        stringsServiceApiUaStub.restore();
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
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });

        it("Create strings with empty parameters", async () => {
            await stringsApi.createStrings(projectId, new CreateStringsParameters());

            sinon.assert.calledOnce(stringsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                stringsServiceApiFetchStub,
                `https://test.com/strings-api/v2/projects/${projectId}`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: "{}"
                }
            );
        });

        it("Create strings with single string", async () => {
            const stringItem = new StringItemParameters("Hello World");
            const parameters = new CreateStringsParameters()
                .addString(stringItem);

            await stringsApi.createStrings(projectId, parameters);

            sinon.assert.calledOnce(stringsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                stringsServiceApiFetchStub,
                `https://test.com/strings-api/v2/projects/${projectId}`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        strings: [stringItem]
                    })
                }
            );
        });

        it("Create strings with full string parameters", async () => {
            const stringItem = new StringItemParameters("Hello World")
                .setVariant("test-variant")
                .setCallbackUrl("https://example.com/callback")
                .setCallbackMethod("POST")
                .setInstruction("Translation instruction")
                .setFormat("html")
                .setMaxLength(100);

            const parameters = new CreateStringsParameters()
                .addString(stringItem);

            await stringsApi.createStrings(projectId, parameters);

            sinon.assert.calledOnce(stringsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                stringsServiceApiFetchStub,
                `https://test.com/strings-api/v2/projects/${projectId}`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        strings: [stringItem]
                    })
                }
            );
        });

        it("Create strings with namespace and placeholder format", async () => {
            const stringItem = new StringItemParameters("Hello {name}");
            const parameters = new CreateStringsParameters()
                .setNamespace("test.namespace")
                .setPlaceholderFormat("java")
                .setPlaceholderFormatCustom("\\[.+?\\]")
                .addString(stringItem);

            await stringsApi.createStrings(projectId, parameters);

            sinon.assert.calledOnce(stringsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                stringsServiceApiFetchStub,
                `https://test.com/strings-api/v2/projects/${projectId}`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        namespace: "test.namespace",
                        placeholderFormat: "java",
                        placeholderFormatCustom: "\\[.+?\\]",
                        strings: [stringItem]
                    })
                }
            );
        });

        it("Create strings with multiple strings", async () => {
            const stringItem1 = new StringItemParameters("Hello World");
            const stringItem2 = new StringItemParameters("Goodbye World")
                .setVariant("variant2");

            const parameters = new CreateStringsParameters()
                .setStrings([stringItem1, stringItem2]);

            await stringsApi.createStrings(projectId, parameters);

            sinon.assert.calledOnce(stringsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                stringsServiceApiFetchStub,
                `https://test.com/strings-api/v2/projects/${projectId}`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        strings: [stringItem1, stringItem2]
                    })
                }
            );
        });

        it("Should throw error when adding more than 100 strings via addString", () => {
            const parameters = new CreateStringsParameters();

            // Add 100 strings
            for (let i = 0; i < 100; i += 1) {
                parameters.addString(new StringItemParameters(`String ${i}`));
            }

            // Adding the 101st string should throw an error
            assert.throws(() => {
                parameters.addString(new StringItemParameters("String 101"));
            }, /Maximum 100 strings can be posted in any given request/);
        });

        it("Should throw error when setting more than 100 strings via setStrings", () => {
            // Create 101 strings using Array.from to avoid mutating methods
            const strings = Array.from({ length: 101 }, (_, i) => new StringItemParameters(`String ${i}`));

            const parameters = new CreateStringsParameters();

            assert.throws(() => {
                parameters.setStrings(strings);
            }, /Maximum 100 strings can be posted in any given request/);
        });

        it("Get create string status", async () => {
            await stringsApi.getCreateStringStatus(projectId, testProcessUid);

            sinon.assert.calledOnce(stringsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                stringsServiceApiFetchStub,
                `https://test.com/strings-api/v2/projects/${projectId}/processes/${testProcessUid}`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });
    });
});
