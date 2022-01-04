import * as fs from "fs";
import sinon from "sinon";
import assert from "assert";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingJobBatchesApi } from "../api/job-batches/index";
import { SmartlingAuthApi } from "../api/auth/index";
import { CreateBatchParameters } from "../api/job-batches/params/create-batch-parameters";
import { UploadBatchFileParameters } from "../api/job-batches/params/upload-batch-file-parameters";
import { FileType } from "../api/files/params/file-type";
import { CancelBatchFileParameters } from "../api/job-batches/params/cancel-batch-file-parameters";
import { RegisterBatchFileParameters } from "../api/job-batches/params/register-batch-file-parameters";
import { streamToString } from "./stream-to-string";

describe("SmartlingJobBatchesAPI class tests.", () => {
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

        it("Cancel batch file action", async () => {
            const params = new CancelBatchFileParameters();

            params
                .setFileUri("test_file_uri");

            await jobBatchesApi.cancelBatchFile(projectId, batchUid, params);

            sinon.assert.calledOnce(jobBatchesApiFetchStub);
            sinon.assert.calledWithExactly(
                jobBatchesApiFetchStub,
                `https://test.com/job-batches-api/v2/projects/${projectId}/batches/${batchUid}`,
                {
                    body: "{\"action\":\"CANCEL_FILE\",\"fileUri\":\"test_file_uri\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put"
                }
            );
        });

        it("Register batch file action", async () => {
            const params = new RegisterBatchFileParameters();

            params
                .setFileUri("test_file_uri");

            await jobBatchesApi.registerBatchFile(projectId, batchUid, params);

            sinon.assert.calledOnce(jobBatchesApiFetchStub);
            sinon.assert.calledWithExactly(
                jobBatchesApiFetchStub,
                `https://test.com/job-batches-api/v2/projects/${projectId}/batches/${batchUid}`,
                {
                    body: "{\"action\":\"REGISTER_FILE\",\"fileUri\":\"test_file_uri\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put"
                }
            );
        });

        it("Upload batch file: from disk", async () => {
            const params = new UploadBatchFileParameters();

            params
                .setFileFromLocalFilePath("./test/data/file.xml")
                .setFileUri("test-file-uri")
                .setFileType(FileType.XML)
                .setDirective("foo", "bar")
                .setLocalesToApprove(["fr-FR", "de-DE"])
                .setCallbackUrl("testCallbackUrl")
                .setClientLibId("clientLibId", "clientLibVersion");

            await jobBatchesApi.uploadBatchFile(projectId, batchUid, params);

            sinon.assert.calledOnce(jobBatchesApiFetchStub);

            assert.equal(
                jobBatchesApiFetchStub.getCall(0).args[0],
                `https://test.com/job-batches-api/v2/projects/${projectId}/batches/${batchUid}/file`
            );

            assert.equal(
                jobBatchesApiFetchStub.getCall(0).args[1].method,
                "post"
            );

            assert.equal(
                jobBatchesApiFetchStub.getCall(0).args[1].headers.Authorization,
                "test_token_type test_access_token"
            );

            assert.equal(
                jobBatchesApiFetchStub.getCall(0).args[1].headers["User-Agent"],
                "test_user_agent"
            );

            assert.equal(
                // eslint-disable-next-line no-underscore-dangle
                await streamToString(jobBatchesApiFetchStub.getCall(0).args[1].body._streams[1]),
                fs.readFileSync(
                    fs.realpathSync("./test/data/file.xml"),
                    "utf8"
                )
            );
        });

        it("Upload batch file: as string", async () => {
            const params = new UploadBatchFileParameters();

            params
                .setFileContent(fs.readFileSync(
                    fs.realpathSync("./test/data/file.xml"),
                    "utf8"
                ))
                .setFileUri("test-file-uri")
                .setFileType(FileType.XML)
                .setDirective("foo", "bar")
                .setLocalesToApprove(["fr-FR", "de-DE"])
                .setCallbackUrl("testCallbackUrl")
                .setClientLibId("clientLibId", "clientLibVersion");

            await jobBatchesApi.uploadBatchFile(projectId, batchUid, params);

            sinon.assert.calledOnce(jobBatchesApiFetchStub);

            assert.equal(
                jobBatchesApiFetchStub.getCall(0).args[0],
                `https://test.com/job-batches-api/v2/projects/${projectId}/batches/${batchUid}/file`
            );

            assert.equal(
                jobBatchesApiFetchStub.getCall(0).args[1].method,
                "post"
            );

            assert.equal(
                jobBatchesApiFetchStub.getCall(0).args[1].headers.Authorization,
                "test_token_type test_access_token"
            );

            assert.equal(
                jobBatchesApiFetchStub.getCall(0).args[1].headers["User-Agent"],
                "test_user_agent"
            );

            assert.equal(
                // eslint-disable-next-line no-underscore-dangle
                await streamToString(jobBatchesApiFetchStub.getCall(0).args[1].body._streams[1]),
                fs.readFileSync(
                    fs.realpathSync("./test/data/file.xml"),
                    "utf8"
                )
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
