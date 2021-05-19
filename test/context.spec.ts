import "mocha"
import sinon from "sinon";
import assert from "assert";
import { SmartlingContextApi } from "../api/context";
import { ContextAutomaticMatchParameters } from "../api/context/params/context-automatic-match-parameters";
import { CreateBindingsParameters } from "../api/context/params/create-bindings-parameters";
import { HtmlBindingDto } from "../api/context/dto/binding/html-binding-dto";

const {loggerMock, authMock, responseMock} = require("./mock");

const projectId = "testProjectId";
const contextUid = "testContextUid";
const fileName = "testContextFileName";

const stringHashCodes = ["testStringHashCode1", "testStringHashCode2"];
const expectedAutomaticMatchParams = {
    stringHashcodes: stringHashCodes,
    contentFileUri: fileName,
    overrideContextOlderThanDays: 1
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

        it("Create strings to context bindings parameters", () => {
            const createBindingsParams: CreateBindingsParameters = new CreateBindingsParameters();
            const htmlBinding1: HtmlBindingDto = {
                contextUid: "1",
                stringHashcode: "1",
                selector: {
                    anchors: ["1"]
                }
            };
            const htmlBinding2: HtmlBindingDto = {
                contextUid: "1",
                stringHashcode: "2",
                selector: {
                    anchors: ["2"]
                }
            };

            createBindingsParams
                .addBinding(htmlBinding1)
                .addBinding(htmlBinding2);

            assert.deepEqual(
                {
                    bindings: [{
                        contextUid: "1",
                        stringHashcode: "1",
                        selector: {
                            anchors: ["1"]
                        }
                    }, {
                        contextUid: "1",
                        stringHashcode: "2",
                        selector: {
                            anchors: ["2"]
                        }
                    }]
                },
                createBindingsParams.export()
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
                    body: JSON.stringify(expectedAutomaticMatchParams),
                    headers: {
                        "Authorization": "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Should create strings to context bindings", async () => {
            const createBindingsParams: CreateBindingsParameters = new CreateBindingsParameters();
            const htmlBinding1: HtmlBindingDto = {
                contextUid: "1",
                stringHashcode: "1",
                selector: {
                    anchors: ["1"]
                }
            };
            const htmlBinding2: HtmlBindingDto = {
                contextUid: "1",
                stringHashcode: "2",
                selector: {
                    anchors: ["2"]
                }
            };

            createBindingsParams
                .addBinding(htmlBinding1)
                .addBinding(htmlBinding2);

            await contextApi.createStringsToContextBindings(projectId, createBindingsParams);

            sinon.assert.calledOnce(contextServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/bindings`,
                {
                    body: JSON.stringify({
                        bindings: [ htmlBinding1, htmlBinding2 ]
                    }),
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
