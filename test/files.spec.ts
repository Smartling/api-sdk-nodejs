import * as fs from "fs";
import sinon from "sinon";
import assert from "assert";
import { SmartlingFilesApi } from "../api/files/index";
import { loggerMock, authMock, responseMock } from "./mock";
import { RetrievalType } from "../api/files/params/retrieval-type";
import { DownloadFileParameters } from "../api/files/params/download-file-parameters";
import { UploadFileParameters } from "../api/files/params/upload-file-parameters";
import { SmartlingAuthApi } from "../api/auth/index";
import { FileType } from "../api/files/params/file-type";
import { streamToString } from "./stream-to-string";

describe("SmartlingFilesApi class tests.", () => {
    const projectId = "testProjectId";
    const fileUri = "testFileUri";
    let filesApi: SmartlingFilesApi;
    let filesApiFetchStub;
    let filesApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        filesApi = new SmartlingFilesApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);
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

        describe("Download file", () => {
            const localeId = "fr-FR";
            let params: DownloadFileParameters;

            beforeEach(() => {
                params = new DownloadFileParameters();
            });

            it("Download file with debugMode enabled and retrievalType published", async () => {
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

            it("Download file with debugMode disabled and retrievalType published", async () => {
                params.setRetrievalType(RetrievalType.PUBLISHED);

                await filesApi.downloadFile(projectId, fileUri, localeId, params);

                sinon.assert.calledOnce(filesApiFetchStub);
                sinon.assert.calledWithExactly(
                    filesApiFetchStub,
                    `https://test.com/files-api/v2/projects/${projectId}/locales/${localeId}/file?retrievalType=published&fileUri=testFileUri`,
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

            it("Download file with includeOriginalStrings enabled", async() => {
                params.setRetrievalType(RetrievalType.PUBLISHED).includeOriginalStrings();

                await filesApi.downloadFile(projectId, fileUri, localeId, params);

                sinon.assert.calledOnce(filesApiFetchStub);
                sinon.assert.calledWithExactly(
                    filesApiFetchStub,
                    `https://test.com/files-api/v2/projects/${projectId}/locales/${localeId}/file?retrievalType=published&includeOriginalStrings=true&fileUri=testFileUri`,
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

            it("Download file with includeOriginalStrings disabled", async() => {
                params.setRetrievalType(RetrievalType.PUBLISHED).excludeOriginalStrings();

                await filesApi.downloadFile(projectId, fileUri, localeId, params);

                sinon.assert.calledOnce(filesApiFetchStub);
                sinon.assert.calledWithExactly(
                    filesApiFetchStub,
                    `https://test.com/files-api/v2/projects/${projectId}/locales/${localeId}/file?retrievalType=published&includeOriginalStrings=false&fileUri=testFileUri`,
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

        it("Upload file: from disk", async () => {
            const params = new UploadFileParameters();

            params
                .setFileFromLocalFilePath("./test/data/file.xml")
                .setFileUri("test-file-uri")
                .setFileType(FileType.XML)
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
                // eslint-disable-next-line no-underscore-dangle
                await streamToString(filesApiFetchStub.getCall(0).args[1].body._streams[1]),
                fs.readFileSync(
                    fs.realpathSync("./test/data/file.xml"),
                    "utf8"
                )
            );
        });

        it("Upload file: as string", async () => {
            const params = new UploadFileParameters();

            params
                .setFileContent(fs.readFileSync(
                    fs.realpathSync("./test/data/file.xml"),
                    "utf8"
                ))
                .setFileUri("test-file-uri")
                .setFileType(FileType.XML)
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
                // eslint-disable-next-line no-underscore-dangle
                await streamToString(filesApiFetchStub.getCall(0).args[1].body._streams[1]),
                fs.readFileSync(
                    fs.realpathSync("./test/data/file.xml"),
                    "utf8"
                )
            );
        });
    });
});
