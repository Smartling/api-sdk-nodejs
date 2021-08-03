import sinon from "sinon";
import assert from "assert";
import { SmartlingFilesApi } from "../api/files";
import { loggerMock, authMock, responseMock } from "./mock";
import { RetrievalType } from "../api/files/params/retrieval-type";
import { DownloadFileParameters } from "../api/files/params/download-file-parameters";
import { UploadFileParameters } from "../api/files/params/upload-file-parameters";
import { SmartlingAuthApi } from "../api/auth/index";

describe("SmartlingStringsApi class tests.", () => {
    const projectId = "testProjectId";
    const fileUri = "testFileUri";
    let filesApi: SmartlingFilesApi;
    let filesApiFetchStub;
    let filesApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        filesApi = new SmartlingFilesApi(authMock as unknown as SmartlingAuthApi, loggerMock, "https://test.com");
        filesApiFetchStub = sinon.stub(filesApi, "fetch");
        filesApiUaStub = sinon.stub(filesApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        filesApiUaStub.returns("test_user_agent");
        filesApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        filesApiFetchStub.restore();
        responseMockJsonStub.restore();
        filesApiUaStub.restore();
    });

    describe("Methods", () => {
        it("Get status for all locales", async () => {
            await filesApi.getStatusForAllLocales(projectId, fileUri);

            sinon.assert.calledOnce(filesApiFetchStub);
            sinon.assert.calledWithExactly(
                filesApiFetchStub,
                `https://test.com/files-api/v2/projects/${projectId}/file/status?fileUri=testFileUri`,
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

        it("Get last modified", async () => {
            await filesApi.getLastModified(projectId, fileUri);

            sinon.assert.calledOnce(filesApiFetchStub);
            sinon.assert.calledWithExactly(
                filesApiFetchStub,
                `https://test.com/files-api/v2/projects/${projectId}/file/last-modified?fileUri=testFileUri`,
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

        it("Download file", async () => {
            const localeId = "fr-FR";
            const params = new DownloadFileParameters();

            params
                .setRetrievalType(RetrievalType.PUBLISHED)
                .enableDebugMode();

            await filesApi.downloadFile(projectId, fileUri, localeId, params);

            sinon.assert.calledOnce(filesApiFetchStub);
            sinon.assert.calledWithExactly(
                filesApiFetchStub,
                `https://test.com/files-api/v2/projects/${projectId}/locales/${localeId}/file?retrievalType=published&debugMode=1&fileUri=testFileUri`,
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

        it("Delete file", async () => {
            await filesApi.deleteFile(projectId, fileUri);

            sinon.assert.calledOnce(filesApiFetchStub);

            assert.equal(
                filesApiFetchStub.getCall(0).args[0],
                `https://test.com/files-api/v2/projects/${projectId}/file/delete`
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].method,
                "post"
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].headers.Authorization,
                "test_token_type test_access_token"
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].headers["User-Agent"],
                "test_user_agent"
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].body.getBuffer().toString().includes("Content-Disposition: form-data; name=\"fileUri\""),
                true
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].body.getBuffer().toString().includes(fileUri),
                true
            );
        });

        it("Upload file", async () => {
            const params = new UploadFileParameters();

            params
                .setFile("./test/file")
                .setFileUri("test-file-uri")
                .setFileType("xml")
                .setDirective("foo", "bar");

            await filesApi.uploadFile(projectId, params);

            sinon.assert.calledOnce(filesApiFetchStub);

            assert.equal(
                filesApiFetchStub.getCall(0).args[0],
                `https://test.com/files-api/v2/projects/${projectId}/file`
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].method,
                "post"
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].headers.Authorization,
                "test_token_type test_access_token"
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].headers["User-Agent"],
                "test_user_agent"
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].body.getBuffer().toString().includes("Content-Disposition: form-data; name=\"file\"; filename=\"file\""),
                true
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].body.getBuffer().toString().includes("Content-Disposition: form-data; name=\"fileUri\""),
                true
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].body.getBuffer().toString().includes("Content-Disposition: form-data; name=\"fileType\""),
                true
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].body.getBuffer().toString().includes("Content-Disposition: form-data; name=\"smartling.foo\""),
                true
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].body.getBuffer().toString().includes("./test/file"),
                true
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].body.getBuffer().toString().includes("test-file-uri"),
                true
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].body.getBuffer().toString().includes("xml"),
                true
            );

            assert.equal(
                filesApiFetchStub.getCall(0).args[1].body.getBuffer().toString().includes("bar"),
                true
            );
        });
    });
});
