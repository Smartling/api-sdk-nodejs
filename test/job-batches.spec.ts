import sinon from "sinon";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingJobBatchesApi } from "../api/job-batches/index";
import { SmartlingAuthApi } from "../api/auth/index";
import { CreateBatchParameters } from "../api/job-batches/params/create-batch-parameters";
import { UploadBatchFileParameters } from "../api/job-batches/params/upload-batch-file-parameters";

describe("SmartlingJobAPI class tests.", () => {
    const projectId = "testProjectId";
    const jobUid = "testJobUid";
    let jobBatchesApi;
    let jobBatchesApiFetchStub;
    let jobServiceApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        jobBatchesApi = new SmartlingJobBatchesApi(authMock as unknown as SmartlingAuthApi, loggerMock, "https://test.com");
        jobBatchesApiFetchStub = sinon.stub(jobBatchesApi, "fetch");
        jobServiceApiUaStub = sinon.stub(jobBatchesApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        jobServiceApiUaStub.returns("test_user_agent");
        jobBatchesApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        jobBatchesApiFetchStub.restore();
        responseMockJsonStub.restore();
        jobServiceApiUaStub.restore();
    });

    describe("Methods", () => {
        it("Create batch", async () => {
            const params = new CreateBatchParameters();

            params
                .setTranslationJobUid(jobUid)
                .setAuthorize(true);

            await jobBatchesApi.createBatch(projectId, params);

            sinon.assert.calledOnce(jobBatchesApiFetchStub);
            sinon.assert.calledWithExactly(
                jobBatchesApiFetchStub,
                `https://test.com/job-batches-api/v1/projects/${projectId}/batches`,
                {
                    body: "{\"translationJobUid\":\"testJobUid\",\"authorize\":true}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Upload batch file", async () => {
            const batchUid = "testBatchUid";
            const params = new UploadBatchFileParameters();

            params
                .setFile("./test/file")
                .setFileUri("test-file-uri")
                .setFileType("xml")
                .setDirective("foo", "bar")
                .setLocalesToApprove(["fr-FR", "de-DE"])
                .setCallbackUrl("callbackUrl")
                .setClientLibId("clientLibId", "clientLibVersion");

            await jobBatchesApi.uploadBatchFile(projectId, batchUid, params);

            sinon.assert.calledOnce(jobBatchesApiFetchStub);
            sinon.assert.calledWithExactly(
                jobBatchesApiFetchStub,
                `https://test.com/job-batches-api/v1/projects/${projectId}/batches/${batchUid}/file`,
                {
                    body: JSON.stringify({
                        file: "./test/file",
                        fileUri: "test-file-uri",
                        fileType: "xml",
                        "smartling.foo": "bar",
                        localeIdsToAuthorize: ["fr-FR", "de-DE"],
                        callbackUrl: "callbackUrl",
                        "smartling.client_lib_id": "{\"client\":\"clientLibId\",\"version\":\"clientLibVersion\"}"
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

        it("Execute batch", async () => {
            const batchUid = "testBatchUid";

            await jobBatchesApi.executeBatch(projectId, batchUid);

            sinon.assert.calledOnce(jobBatchesApiFetchStub);
            sinon.assert.calledWithExactly(
                jobBatchesApiFetchStub,
                `https://test.com/job-batches-api/v1/projects/${projectId}/batches/${batchUid}`,
                {
                    body: "{\"action\":\"execute\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Get batch status", async () => {
            const batchUid = "testBatchUid";

            await jobBatchesApi.getBatchStatus(projectId, batchUid);

            sinon.assert.calledOnce(jobBatchesApiFetchStub);
            sinon.assert.calledWithExactly(
                jobBatchesApiFetchStub,
                `https://test.com/job-batches-api/v1/projects/${projectId}/batches/${batchUid}`,
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
