import sinon from "sinon";
import assert from "assert";
import { SmartlingContextApi } from "../api/context/index";
import { ContextAutomaticMatchParameters } from "../api/context/params/context-automatic-match-parameters";
import { CreateBindingsParameters } from "../api/context/params/create-bindings-parameters";
import { HtmlBindingDto } from "../api/context/dto/binding/html-binding-dto";
import { ListParameters } from "../api/context/params/list-parameters";
import { ContextType } from "../api/context/params/context-type";
import { loggerMock, authMock, responseMock } from "./mock";
import { ContextUploadParameters } from "../api/context/params/context-upload-parameters";
import { SmartlingAuthApi } from "../api/auth/index";

describe("SmartlingContextApi class tests.", () => {
    const projectId = "testProjectId";
    const contextUid = "testContextUid";
    const fileName = "testContextFileName";
    const stringHashCodes = ["testStringHashCode1", "testStringHashCode2"];
    const expectedAutomaticMatchParams = {
        stringHashcodes: stringHashCodes,
        contentFileUri: fileName,
        overrideContextOlderThanDays: 1
    };
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

        contextApi = new SmartlingContextApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);
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

    describe("Methods", () => {
        it("Should upload context", async () => {
            const params = new ContextUploadParameters();

            params
                .setName("contextName")
                .setContent("contextContent");

            await contextApi.upload(projectId, params, {
                group: "testGroup",
                name: "testName",
                version: "testVersion"
            });

            assert.equal(
                contextServiceApiFetchStub.getCall(0).args[0],
                `https://test.com/context-api/v2/projects/${projectId}/contexts`
            );

            assert.equal(
                contextServiceApiFetchStub.getCall(0).args[1].method,
                "post"
            );

            assert.equal(
                contextServiceApiFetchStub.getCall(0).args[1].headers.Authorization,
                "test_token_type test_access_token"
            );

            assert.equal(
                contextServiceApiFetchStub.getCall(0).args[1].headers["User-Agent"],
                "test_user_agent"
            );

            assert.equal(
                contextServiceApiFetchStub.getCall(0).args[1].headers["X-SL-Context-Source"],
                "group=testGroup;name=testName;version=testVersion"
            );
        });

        it("Should run automatic matching", async () => {
            await contextApi.runAutomaticMatch(
                projectId, contextUid, contextAutomaticMatchParameters
            );

            sinon.assert.calledOnce(contextServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/contexts/${contextUid}/match/async`,
                {
                    body: JSON.stringify(expectedAutomaticMatchParams),
                    headers: {
                        Authorization: "test_token_type test_access_token",
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
                        bindings: [htmlBinding1, htmlBinding2]
                    }),
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Should list contexts by project", async () => {
            const listParams = new ListParameters();

            listParams
                .setNameFilter("nameFilter")
                .setOffset("offset")
                .setType(ContextType.HTML);

            await contextApi.listContexts(projectId, listParams);

            sinon.assert.calledOnce(contextServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/contexts?nameFilter=nameFilter&offset=offset&type=HTML`,
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

        it("Should delete context by context uid", async () => {
            await contextApi.delete(projectId, "context_uid");

            sinon.assert.calledOnce(contextServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/contexts/context_uid`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "delete"
                }
            );
        });
    });
});
