import sinon from "sinon";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingJobBatchesApi } from "../api/job-batches/index";
import { SmartlingAuthApi } from "../api/auth/index";
import { CreateBatchParameters } from "../api/job-batches/params/create-batch-parameters";
import { UploadBatchFileParameters } from "../api/job-batches/params/upload-batch-file-parameters";
import { FileType } from "../api/files/params/file-type";
import { ProcessBatchActionParameters } from "../api/job-batches/params/process-batch-action-parameters";
import { BatchAction } from "../api/job-batches/params/batch-action";

describe("SmartlingJobAPI class tests.", () => {
    const projectId = "testProjectId";
    const jobUid = "testJobUid";
    const batchUid = "testBatchUid";
    let jobBatchesApi;
    let jobBatchesApiFetchStub;
    let jobServiceApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        jobBatchesApi = new SmartlingJobBatchesApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);
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
                .setAuthorize(true)
                .addFileUri("test_file_uri_1")
                .addFileUri("test_file_uri_2")
                .addLocaleWorkflows("fr", "wf1")
                .addLocaleWorkflows("de", "wf2");

            await jobBatchesApi.createBatch(projectId, params);

            sinon.assert.calledOnce(jobBatchesApiFetchStub);
            sinon.assert.calledWithExactly(
                jobBatchesApiFetchStub,
                `https://test.com/job-batches-api/v2/projects/${projectId}/batches`,
                {
                    body: "{\"fileUris\":[\"test_file_uri_1\",\"test_file_uri_2\"],\"localeWorkflows\":[{\"targetLocaleId\":\"fr\",\"workflowUid\":\"wf1\"},{\"targetLocaleId\":\"de\",\"workflowUid\":\"wf2\"}],\"translationJobUid\":\"testJobUid\",\"authorize\":true}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Process batch action", async () => {
            const params = new ProcessBatchActionParameters();

            params
                .setAction(BatchAction.CANCEL_FILE)
                .setFileUri("test_file_uri")
                .setReason("test reason");

            await jobBatchesApi.processBatchAction(projectId, batchUid, params);

            sinon.assert.calledOnce(jobBatchesApiFetchStub);
            sinon.assert.calledWithExactly(
                jobBatchesApiFetchStub,
                `https://test.com/job-batches-api/v2/projects/${projectId}/batches/${batchUid}`,
                {
                    body: "{\"action\":\"CANCEL_FILE\",\"fileUri\":\"test_file_uri\",\"reason\":\"test reason\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put"
                }
            );
        });

        it("Upload batch file", async () => {
            const params = new UploadBatchFileParameters();

            params
                .setFile("./test/file")
                .setFileUri("test-file-uri")
                .setFileType(FileType.XML)
                .setDirective("foo", "bar")
                .setLocalesToApprove(["fr-FR", "de-DE"])
                .setCallbackUrl("callbackUrl")
                .setClientLibId("clientLibId", "clientLibVersion");

            await jobBatchesApi.uploadBatchFile(projectId, batchUid, params);

            sinon.assert.calledOnce(jobBatchesApiFetchStub);
            sinon.assert.calledWithExactly(
                jobBatchesApiFetchStub,
                `https://test.com/job-batches-api/v2/projects/${projectId}/batches/${batchUid}/file`,
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

        it("Get batch status", async () => {
            await jobBatchesApi.getBatchStatus(projectId, batchUid);

            sinon.assert.calledOnce(jobBatchesApiFetchStub);
            sinon.assert.calledWithExactly(
                jobBatchesApiFetchStub,
                `https://test.com/job-batches-api/v2/projects/${projectId}/batches/${batchUid}`,
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
