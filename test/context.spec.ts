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
import { ResponseBodyType } from "../api/base/enum/response-body-type";
import { DeleteContextsAsyncParameters } from "../api/context/params/delete-contexts-async-parameters";
import { ContextUploadAndMatchParameters } from "../api/context/params/context-upload-and-match-parameters";
import { ListBindingsParameters } from "../api/context/params/list-bindings-parameters";
import { DeleteBindingsParameters } from "../api/context/params/delete-bindings-parameters";
import { VideoMatchingMode } from "../api/context/params/video-matching-mode";
import { SmartlingException } from "../api/exception/index";
import { ContextProcessState } from "../api/context/params/context-process-state";
import { ProcessType } from "../api/context/params/process-type";

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
        sinon.restore();
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
            // Given
            sinon.stub(responseMock, "text").returns(JSON.stringify({
                response: { data: { processUid: "process-1", matchId: "match-1" } }
            }));

            // When
            const result = await contextApi.runAutomaticMatch(
                projectId, contextUid, contextAutomaticMatchParameters
            );

            // Then
            assert.strictEqual(result.processUid, "process-1");
            assert.strictEqual(result.matchId, "match-1");
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

        it("Should reject a non-integer override-context-older-than-days value", () => {
            // When / Then
            assert.throws(
                () => new ContextAutomaticMatchParameters().setOverrideContextOlderThanDays(NaN),
                SmartlingException
            );
            assert.throws(
                () => new ContextAutomaticMatchParameters().setOverrideContextOlderThanDays(0.5),
                SmartlingException
            );
            assert.throws(
                () => new ContextAutomaticMatchParameters().setOverrideContextOlderThanDays(-1),
                SmartlingException
            );
            assert.doesNotThrow(
                () => new ContextAutomaticMatchParameters().setOverrideContextOlderThanDays(0)
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

        it("Should reject more than 150 bindings in a single request", () => {
            // Given
            const params = new CreateBindingsParameters();
            const binding: HtmlBindingDto = {
                contextUid: "1",
                stringHashcode: "1",
                selector: { anchors: ["1"] }
            };

            for (let i = 0; i < 150; i += 1) {
                params.addBinding(binding);
            }

            // When / Then
            assert.throws(
                () => params.addBinding(binding),
                (e: unknown) => e instanceof SmartlingException
                    && (e as SmartlingException).message === "Cannot create more than 150 bindings at once, got 151"
            );

            // The rejected binding must not have been appended to the list.
            assert.strictEqual((params.export().bindings as Array<HtmlBindingDto>).length, 150);
        });

        it("Should correctly unwrap created/errors binding lists (regression: 'created' must not collapse into Invalid Date)", async () => {
            // Given
            sinon.stub(responseMock, "text").returns(JSON.stringify({
                response: {
                    data: {
                        created: {
                            totalCount: 1,
                            items: [{ contextUid: "1", stringHashcode: "1" }]
                        },
                        errors: { totalCount: 0, items: [] }
                    }
                }
            }));

            const createBindingsParams = new CreateBindingsParameters().addBinding({
                contextUid: "1",
                stringHashcode: "1",
                selector: { anchors: ["1"] }
            });

            // When
            const result = await contextApi
                .createStringsToContextBindings(projectId, createBindingsParams);

            // Then
            assert.strictEqual(result.errors.totalCount, 0);
            assert.ok(
                result.created instanceof Object && !(result.created instanceof Date),
                "'created' must not be coerced into an Invalid Date"
            );
            assert.strictEqual(result.created.totalCount, 1);
            assert.strictEqual(result.created.items.length, 1);
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
            const result = await contextApi.delete(projectId, "context_uid");

            assert.strictEqual(result, undefined);
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

        it("Should resolve with undefined on a real empty 204 delete response", async () => {
            // Given
            contextServiceApiFetchStub.returns({
                ...responseMock,
                status: 204,
                text: async (): Promise<string> => ""
            });

            // When
            const result = await contextApi.delete(projectId, "context_uid");

            // Then
            assert.strictEqual(result, undefined);
        });

        const expectedHeaders = {
            Authorization: "test_token_type test_access_token",
            "Content-Type": "application/json",
            "User-Agent": "test_user_agent"
        };

        it("Should get context", async () => {
            // Given
            sinon.stub(responseMock, "text").returns(JSON.stringify({
                response: {
                    data: {
                        name: "contextName",
                        contextType: ContextType.HTML,
                        created: "2024-01-01T00:00:00.000Z",
                        contextUid
                    }
                }
            }));

            // When
            const context = await contextApi.getContext(projectId, contextUid);

            // Then
            assert.strictEqual(context.contextUid, contextUid);
            assert.ok(context.created instanceof Date);
            sinon.assert.calledOnce(contextServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/contexts/${contextUid}`,
                { headers: expectedHeaders, method: "get" }
            );
        });

        it("Should download context content as text", async () => {
            // Given
            sinon.stub(responseMock, "text").returns("<html></html>");

            // When
            const content = await contextApi.downloadContextContent(
                projectId, contextUid, ResponseBodyType.TEXT
            );

            // Then
            assert.equal(content, "<html></html>");
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/contexts/${contextUid}/content`,
                { headers: expectedHeaders, method: "get" }
            );
        });

        it("Should download context content as an array buffer by default", async () => {
            // When
            const content = await contextApi.downloadContextContent(projectId, contextUid);

            // Then
            assert.ok(content instanceof ArrayBuffer);
        });

        it("Should return null downloading context content from a 204 response", async () => {
            // Given
            contextServiceApiFetchStub.returns({ ...responseMock, status: 204 });

            // When
            const content = await contextApi.downloadContextContent(projectId, contextUid);

            // Then
            assert.strictEqual(content, null);
        });

        it("Should delete contexts asynchronously", async () => {
            // Given
            const params = new DeleteContextsAsyncParameters().setContextUids(["uid1", "uid2"]);

            // When
            await contextApi.deleteContextsAsync(projectId, params);

            // Then
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/contexts/remove/async`,
                {
                    body: JSON.stringify({ contextUids: ["uid1", "uid2"] }),
                    headers: expectedHeaders,
                    method: "post"
                }
            );
        });

        it("Should reject deleting more than 100 contexts", () => {
            // Given
            const uids = Array.from({ length: 101 }, (_, i) => `uid${i}`);

            // When-Then
            assert.throws(
                () => new DeleteContextsAsyncParameters().setContextUids(uids),
                (e: unknown) => e instanceof SmartlingException
                    && (e as SmartlingException).message === "Cannot delete more than 100 contexts at once, got 101"
            );
        });

        it("Should accept exactly 100 contexts", () => {
            // Given
            const uids = Array.from({ length: 100 }, (_, i) => `uid${i}`);

            // When-Then
            assert.doesNotThrow(() => new DeleteContextsAsyncParameters().setContextUids(uids));
        });

        it("Should not let a later mutation of the source array bypass the 100-context limit", () => {
            // Given
            const uids = ["uid1", "uid2"];
            const params = new DeleteContextsAsyncParameters().setContextUids(uids);

            // When
            uids[2] = "uid3";

            // Then
            assert.strictEqual((params.export().contextUids as Array<string>).length, 2);
        });

        it("Should upload and match context", async () => {
            // Given
            const params = new ContextUploadAndMatchParameters()
                .setName("contextName")
                .setFileUri(fileName)
                .setVideoMatchingMode(VideoMatchingMode.OCR);

            // When
            await contextApi.uploadAndMatchContext(projectId, params, {
                group: "testGroup",
                name: "testName",
                version: "testVersion"
            });

            // Then
            const [uri, opts] = contextServiceApiFetchStub.getCall(0).args;

            assert.equal(
                uri,
                `https://test.com/context-api/v2/projects/${projectId}/contexts/upload-and-match-async`
            );
            assert.equal(opts.method, "post");
            assert.equal(opts.headers["X-SL-Context-Source"], "group=testGroup;name=testName;version=testVersion");
            assert.match(opts.headers["Content-Type"], /^multipart\/form-data; boundary=/);
            assert.match(
                opts.body.getBuffer().toString(),
                /name="matchParams"[\s\S]*\{"contentFileUri":"testContextFileName","videoMatchingMode":"OCR"\}/
            );
        });

        it("Should send a single translation job uid wrapped as an array", async () => {
            // Given
            const params = new ContextUploadAndMatchParameters()
                .setName("contextName")
                .setFileUri(fileName)
                .setTranslationJobUid("job-1");

            // When
            await contextApi.uploadAndMatchContext(projectId, params);

            // Then
            const [, opts] = contextServiceApiFetchStub.getCall(0).args;

            assert.match(
                opts.body.getBuffer().toString(),
                /name="matchParams"[\s\S]*"translationJobUids":\["job-1"\]/
            );
        });

        it("Should reject a non-integer override-context-older-than-days value on upload-and-match params", () => {
            // When / Then
            assert.throws(
                () => new ContextUploadAndMatchParameters().setOverrideContextOlderThanDays(NaN),
                SmartlingException
            );
            assert.throws(
                () => new ContextUploadAndMatchParameters().setOverrideContextOlderThanDays(0.5),
                SmartlingException
            );
            assert.throws(
                () => new ContextUploadAndMatchParameters().setOverrideContextOlderThanDays(-1),
                SmartlingException
            );
            assert.doesNotThrow(
                () => new ContextUploadAndMatchParameters().setOverrideContextOlderThanDays(0)
            );
        });

        it("Should not re-corrupt the FormData body on a 401 retry", async () => {
            // Given
            const params = new ContextUploadAndMatchParameters()
                .setName("contextName")
                .setFileUri(fileName)
                .setVideoMatchingMode(VideoMatchingMode.OCR);

            contextServiceApiFetchStub.onCall(0).returns({ status: 401 });
            contextServiceApiFetchStub.onCall(1).returns(responseMock);

            // When
            await contextApi.uploadAndMatchContext(projectId, params);

            // Then
            sinon.assert.calledTwice(contextServiceApiFetchStub);

            const firstBody = contextServiceApiFetchStub.getCall(0).args[1].body;
            const secondBody = contextServiceApiFetchStub.getCall(1).args[1].body;

            assert.notStrictEqual(firstBody, secondBody);

            const matchParamsPattern = /name="matchParams"[\s\S]*\{"contentFileUri":"testContextFileName","videoMatchingMode":"OCR"\}/;

            assert.match(firstBody.getBuffer().toString(), matchParamsPattern);
            assert.match(secondBody.getBuffer().toString(), matchParamsPattern);
        });

        it("Should get match results", async () => {
            // Given
            sinon.stub(responseMock, "text").returns(JSON.stringify({
                response: {
                    data: {
                        matchId: "matchId",
                        status: "COMPLETED",
                        createdDate: "2024-01-01T00:00:00.000Z",
                        modifiedDate: "2024-01-01T00:00:00.000Z"
                    }
                }
            }));

            // When
            const match = await contextApi.getMatchResults(projectId, "matchId");

            // Then
            assert.strictEqual(match.matchId, "matchId");
            assert.ok(match.createdDate instanceof Date);
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/match/matchId`,
                { headers: expectedHeaders, method: "get" }
            );
        });

        it("Should get process results", async () => {
            // Given
            sinon.stub(responseMock, "text").returns(JSON.stringify({
                response: {
                    data: {
                        processUid: "processUid",
                        processState: ContextProcessState.COMPLETED,
                        processType: ProcessType.MATCH_CONTEXT,
                        createdDate: "2024-01-01T00:00:00.000Z",
                        modifiedDate: "2024-01-01T00:00:00.000Z",
                        result: { contextUid: "ctx-1", bindings: [] }
                    }
                }
            }));

            // When
            const process = await contextApi.getProcessResults(projectId, "processUid");

            // Then
            assert.strictEqual(process.processUid, "processUid");
            assert.strictEqual(process.processType, ProcessType.MATCH_CONTEXT);
            if (process.processType === ProcessType.MATCH_CONTEXT) {
                assert.strictEqual(process.result?.contextUid, "ctx-1");
            }
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/processes/processUid`,
                { headers: expectedHeaders, method: "get" }
            );
        });

        it("Should list bindings", async () => {
            // Given
            const params = new ListBindingsParameters()
                .setContextUid(contextUid)
                .setOffset("offset value");

            sinon.stub(responseMock, "text").returns(JSON.stringify({
                response: {
                    data: { items: [{ contextUid, stringHashcode: stringHashCodes[0] }] }
                }
            }));

            // When
            const bindings = await contextApi.listBindings(projectId, params);

            // Then
            assert.strictEqual(bindings.items.length, 1);
            assert.strictEqual(bindings.items[0].contextUid, contextUid);
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/bindings/list?offset=offset%20value`,
                {
                    body: JSON.stringify({ contextUid }),
                    headers: expectedHeaders,
                    method: "post"
                }
            );
        });

        it("Should list bindings with no filter set", async () => {
            // Given
            sinon.stub(responseMock, "text").returns(JSON.stringify({
                response: {
                    data: { items: [] }
                }
            }));

            // When / Then
            await contextApi.listBindings(projectId, new ListBindingsParameters());

            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/bindings/list`,
                {
                    body: JSON.stringify({}),
                    headers: expectedHeaders,
                    method: "post"
                }
            );
        });

        it("Should reject listing bindings with more than one filter set", async () => {
            // Given
            const params = new ListBindingsParameters()
                .setContextUid(contextUid)
                .setStringHashcodes(stringHashCodes);

            // When / Then
            await assert.rejects(
                () => contextApi.listBindings(projectId, params),
                SmartlingException
            );
            sinon.assert.notCalled(contextServiceApiFetchStub);
        });

        it("Should list bindings without offset query", async () => {
            // Given
            const params = new ListBindingsParameters().setContextUid(contextUid);

            // When
            await contextApi.listBindings(projectId, params);

            // Then
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/bindings/list`,
                {
                    body: JSON.stringify({ contextUid }),
                    headers: expectedHeaders,
                    method: "post"
                }
            );
        });

        it("Should delete bindings", async () => {
            // Given
            const params = new DeleteBindingsParameters().setBindingUids(["binding1"]);

            // When
            await contextApi.deleteBindings(projectId, params);

            // Then
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/bindings/remove`,
                {
                    body: JSON.stringify({ bindingUids: ["binding1"] }),
                    headers: expectedHeaders,
                    method: "post"
                }
            );
        });

        it("Should reject deleting bindings with no filter set", async () => {
            // When / Then
            await assert.rejects(
                () => contextApi.deleteBindings(projectId, new DeleteBindingsParameters()),
                SmartlingException
            );
            sinon.assert.notCalled(contextServiceApiFetchStub);
        });

        it("Should reject deleting bindings with more than one filter set", async () => {
            // Given
            const params = new DeleteBindingsParameters()
                .setBindingUids(["binding1"])
                .setContentFileUri(fileName);

            // When / Then
            await assert.rejects(
                () => contextApi.deleteBindings(projectId, params),
                SmartlingException
            );
            sinon.assert.notCalled(contextServiceApiFetchStub);
        });

        it("Should reject deleting bindings with an empty bindingUids array", async () => {
            const params = new DeleteBindingsParameters().setBindingUids([]);

            await assert.rejects(
                () => contextApi.deleteBindings(projectId, params),
                SmartlingException
            );
            sinon.assert.notCalled(contextServiceApiFetchStub);
        });

        it("Should reject deleting bindings with a blank contentFileUri", async () => {
            const params = new DeleteBindingsParameters().setContentFileUri("  ");

            await assert.rejects(
                () => contextApi.deleteBindings(projectId, params),
                SmartlingException
            );
            sinon.assert.notCalled(contextServiceApiFetchStub);
        });

        it("Should reject deleting bindings with a null contextUid", async () => {
            const params = new DeleteBindingsParameters().setContextUid(null);

            await assert.rejects(
                () => contextApi.deleteBindings(projectId, params),
                SmartlingException
            );
            sinon.assert.notCalled(contextServiceApiFetchStub);
        });

        it("Should not reject deleting bindings with one empty filter alongside a set one", async () => {
            // Given
            const params = new DeleteBindingsParameters()
                .setStringHashcodes([])
                .setContextUid(contextUid);

            // When
            await contextApi.deleteBindings(projectId, params);

            // Then
            sinon.assert.calledWithExactly(
                contextServiceApiFetchStub,
                `https://test.com/context-api/v2/projects/${projectId}/bindings/remove`,
                {
                    body: JSON.stringify({ stringHashcodes: [], contextUid }),
                    headers: expectedHeaders,
                    method: "post"
                }
            );
        });
    });
});
