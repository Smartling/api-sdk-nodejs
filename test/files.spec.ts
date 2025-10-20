import * as fs from "fs";
import sinon from "sinon";
import assert from "assert";
import { SmartlingFilesApi } from "../api/files/index";
import { authMock, loggerMock, responseMock } from "./mock";
import { RetrievalType } from "../api/files/params/retrieval-type";
import { DownloadFileParameters } from "../api/files/params/download-file-parameters";
import { DownloadFileWithMetadataParameters } from "../api/files/params/download-file-with-metadata-parameters";
import { UploadFileParameters } from "../api/files/params/upload-file-parameters";
import { SmartlingAuthApi } from "../api/auth/index";
import { FileType } from "../api/files/params/file-type";
import { streamToString } from "./stream-to-string";
import { DownloadFileAllTranslationsParameters } from "../api/files/params/download-file-all-translations-parameters";
import { RecentlyUploadedFilesParameters } from "../api/files/params/recently-uploaded-files";
import { FileNameMode } from "../api/files/params/filename-mode";
import { DownloadMultipleFilesTranslationsParameters } from "../api/files/params/download-multiple-files-translations-parameters";
import { FileLocales } from "../api/files/params/file-locales";
import { SmartlingException } from "../api/exception";
import { TranslationFileNameMode } from "../api/files/params/translation-file-name-mode";
import { FileLocaleMode } from "../api/files/params/file-locale-mode";
import { FileFilter } from "../api/files/params/file-filter";

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

        it("Get recently uploaded files for project", async () => {
            const params = new RecentlyUploadedFilesParameters()
                .setOffset(0)
                .setLimit(99)
                .setUriMask("TEST");

            await filesApi.getRecentlyUploadedFiles(projectId, params);

            sinon.assert.calledOnce(filesApiFetchStub);
            sinon.assert.calledWithExactly(
                filesApiFetchStub,
                `https://test.com/files-api/v2/projects/${projectId}/files/list?offset=0&limit=99&uriMask=TEST`,
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

                await filesApi.downloadFile(
                    projectId,
                    fileUri,
                    localeId,
                    params
                );

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

                await filesApi.downloadFile(
                    projectId,
                    fileUri,
                    localeId,
                    params
                );

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

                await filesApi.downloadFile(
                    projectId,
                    fileUri,
                    localeId,
                    params
                );

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

                await filesApi.downloadFile(
                    projectId,
                    fileUri,
                    localeId,
                    params
                );

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

        describe("Download file with metadata", () => {
            let getHeaderStub;
            const localeId = "fr-FR";
            let params: DownloadFileWithMetadataParameters;

            beforeEach(() => {
                params = new DownloadFileWithMetadataParameters();
                getHeaderStub = sinon.stub(responseMock.headers, "get");
                getHeaderStub.returns(null);
            });

            afterEach(() => {
                getHeaderStub.restore();
            });

            it("Download file when no headers in response", async () => {
                const fileWithMetadata = await filesApi.downloadFileWithMetadata(
                    projectId,
                    fileUri,
                    localeId,
                    params
                );

                sinon.assert.calledOnce(filesApiFetchStub);
                sinon.assert.calledWithExactly(
                    filesApiFetchStub,
                    `https://test.com/files-api/v2/projects/${projectId}/locales/${localeId}/file?fileUri=testFileUri`,
                    {
                        headers: {
                            Authorization: "test_token_type test_access_token",
                            "Content-Type": "application/json",
                            "User-Agent": "test_user_agent"
                        },
                        method: "get"
                    }
                );

                assert.ok(fileWithMetadata.contentType === undefined);
                assert.ok(fileWithMetadata.fileName === undefined);
                assert.ok(fileWithMetadata.fileContent.byteLength === 1);
            });

            it("Download file with metadata", async () => {
                getHeaderStub.onCall(0).returns("application/xml");
                getHeaderStub.onCall(1).returns("attachment; filename=\"test.xml\"");
                getHeaderStub.returns(null);

                const fileWithMetadata = await filesApi.downloadFileWithMetadata(
                    projectId,
                    fileUri,
                    localeId,
                    params
                );

                sinon.assert.calledOnce(filesApiFetchStub);
                sinon.assert.calledWithExactly(
                    filesApiFetchStub,
                    `https://test.com/files-api/v2/projects/${projectId}/locales/${localeId}/file?fileUri=testFileUri`,
                    {
                        headers: {
                            Authorization: "test_token_type test_access_token",
                            "Content-Type": "application/json",
                            "User-Agent": "test_user_agent"
                        },
                        method: "get"
                    }
                );

                assert.ok(fileWithMetadata.contentType === "application/xml");
                assert.ok(fileWithMetadata.fileName === "test.xml");
                assert.ok(fileWithMetadata.fileContent.byteLength === 1);
            });

            it("Download file with fileNameMode original", async () => {
                params.setFileNameMode(FileNameMode.ORIGINAL);

                getHeaderStub.onCall(0).returns("application/xml");
                getHeaderStub.onCall(1).returns("attachment; filename=\"test.xml\"");
                getHeaderStub.returns(null);

                const fileWithMetadata = await filesApi.downloadFileWithMetadata(
                    projectId,
                    fileUri,
                    localeId,
                    params
                );

                sinon.assert.calledOnce(filesApiFetchStub);
                sinon.assert.calledWithExactly(
                    filesApiFetchStub,
                    `https://test.com/files-api/v2/projects/${projectId}/locales/${localeId}/file?fileUri=testFileUri`,
                    {
                        headers: {
                            Authorization: "test_token_type test_access_token",
                            "Content-Type": "application/json",
                            "User-Agent": "test_user_agent"
                        },
                        method: "get"
                    }
                );

                assert.ok(fileWithMetadata.contentType === "application/xml");
                assert.ok(fileWithMetadata.fileName === "test.xml");
                assert.ok(fileWithMetadata.fileContent.byteLength === 1);
            });

            it("Download file with fileNameMode transformed", async () => {
                params.setFileNameMode(FileNameMode.TRANSFORMED);

                getHeaderStub.onCall(0).returns("application/xml");
                getHeaderStub.onCall(1).returns("attachment; filename=\"test.xml\"");
                getHeaderStub.returns(null);

                const fileWithMetadata = await filesApi.downloadFileWithMetadata(
                    projectId,
                    fileUri,
                    localeId,
                    params
                );

                sinon.assert.calledOnce(filesApiFetchStub);
                sinon.assert.calledWithExactly(
                    filesApiFetchStub,
                    `https://test.com/files-api/v2/projects/${projectId}/locales/${localeId}/file?changeFileName=true&fileUri=testFileUri`,
                    {
                        headers: {
                            Authorization: "test_token_type test_access_token",
                            "Content-Type": "application/json",
                            "User-Agent": "test_user_agent"
                        },
                        method: "get"
                    }
                );

                assert.ok(fileWithMetadata.contentType === "application/xml");
                assert.ok(fileWithMetadata.fileName === "test.xml");
                assert.ok(fileWithMetadata.fileContent.byteLength === 1);
            });

            it("Download file with debugMode enabled and retrievalType published", async () => {
                params
                    .setRetrievalType(RetrievalType.PUBLISHED)
                    .enableDebugMode();

                getHeaderStub.onCall(0).returns("application/json");
                getHeaderStub.onCall(1).returns("attachment; filename=\"test.json\"");
                getHeaderStub.returns(null);

                const fileWithMetadata = await filesApi.downloadFileWithMetadata(
                    projectId,
                    fileUri,
                    localeId,
                    params
                );

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
                assert.ok(fileWithMetadata.contentType === "application/json");
                assert.ok(fileWithMetadata.fileName === "test.json");
                assert.ok(fileWithMetadata.fileContent.byteLength === 1);
            });

            it("Download file with debugMode disabled and retrievalType published", async () => {
                params.setRetrievalType(RetrievalType.PUBLISHED);

                getHeaderStub.onCall(0).returns("application/json");
                getHeaderStub.onCall(1).returns("attachment; filename=\"test.json\"");
                getHeaderStub.returns(null);

                const fileWithMetadata = await filesApi.downloadFileWithMetadata(
                    projectId,
                    fileUri,
                    localeId,
                    params
                );

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
                assert.ok(fileWithMetadata.contentType === "application/json");
                assert.ok(fileWithMetadata.fileName === "test.json");
                assert.ok(fileWithMetadata.fileContent.byteLength === 1);
            });

            it("Download file with includeOriginalStrings enabled", async() => {
                params.setRetrievalType(RetrievalType.PUBLISHED).includeOriginalStrings();

                getHeaderStub.onCall(0).returns("application/json");
                getHeaderStub.onCall(1).returns("attachment; filename=\"test.json\"");
                getHeaderStub.returns(null);

                const fileWithMetadata = await filesApi.downloadFileWithMetadata(
                    projectId,
                    fileUri,
                    localeId,
                    params
                );

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
                assert.ok(fileWithMetadata.contentType === "application/json");
                assert.ok(fileWithMetadata.fileName === "test.json");
                assert.ok(fileWithMetadata.fileContent.byteLength === 1);
            });

            it("Download file with includeOriginalStrings disabled", async() => {
                params.setRetrievalType(RetrievalType.PUBLISHED).excludeOriginalStrings();

                getHeaderStub.onCall(0).returns("application/json");
                getHeaderStub.onCall(1).returns("attachment; filename=\"test.json\"");
                getHeaderStub.returns(null);

                const fileWithMetadata = await filesApi.downloadFileWithMetadata(
                    projectId,
                    fileUri,
                    localeId,
                    params
                );

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
                assert.ok(fileWithMetadata.contentType === "application/json");
                assert.ok(fileWithMetadata.fileName === "test.json");
                assert.ok(fileWithMetadata.fileContent.byteLength === 1);
            });
        });

        describe("Download file - all translations", () => {
            let params: DownloadFileAllTranslationsParameters;

            beforeEach(() => {
                params = new DownloadFileAllTranslationsParameters();
            });

            it("Supports all parameters of single file download", async () => {
                params
                    .setRetrievalType(RetrievalType.PUBLISHED)
                    .enableDebugMode();

                await filesApi.downloadFileAllTranslations(projectId, fileUri, params);

                sinon.assert.calledOnce(filesApiFetchStub);
                sinon.assert.calledWithExactly(
                    filesApiFetchStub,
                    `https://test.com/files-api/v2/projects/${projectId}/locales/all/file/zip?retrievalType=published&debugMode=1&fileUri=testFileUri`,
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
                .setCallbackUrl("https://callback.url")
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

            const stringifiedFormData = JSON.stringify(filesApiFetchStub.getCall(0).args[1].body);

            assert.ok(stringifiedFormData.includes("Content-Disposition: form-data; name=\\\"callbackUrl\\\"\\r\\n\\r\\n\",\"https://callback.url\""));

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
                .setCallbackUrl("https://callback.url")
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

            const stringifiedFormData = JSON.stringify(filesApiFetchStub.getCall(0).args[1].body);

            assert.ok(stringifiedFormData.includes("Content-Disposition: form-data; name=\\\"callbackUrl\\\"\\r\\n\\r\\n\",\"https://callback.url\""));

            assert.equal(
                // eslint-disable-next-line no-underscore-dangle
                await streamToString(filesApiFetchStub.getCall(0).args[1].body._streams[1]),
                fs.readFileSync(
                    fs.realpathSync("./test/data/file.xml"),
                    "utf8"
                )
            );
        });

        describe("Download multiple files translations", () => {
            const localeId = "fr-FR";
            const anotherLocaleId = "de-DE";
            const files: FileLocales[] = [
                {
                    fileUri,
                    localeIds: [localeId, anotherLocaleId]
                }
            ];
            let params: DownloadMultipleFilesTranslationsParameters;

            beforeEach(() => {
                params = new DownloadMultipleFilesTranslationsParameters(files);
            });

            it("throws error if file is missing", () => {
                assert.throws(() => {
                    // eslint-disable-next-line no-new
                    new DownloadMultipleFilesTranslationsParameters([]);
                }, SmartlingException);
            });

            it("throws error if localeId is missing", () => {
                assert.throws(() => {
                    // eslint-disable-next-line no-new
                    new DownloadMultipleFilesTranslationsParameters([{
                        fileUri,
                        localeIds: []
                    }]);
                }, SmartlingException);
            });

            it("Download mutliple files translations", async () => {
                await filesApi.downloadMultipleFilesTranslations(
                    projectId,
                    params
                );

                sinon.assert.calledOnce(filesApiFetchStub);
                sinon.assert.calledWithExactly(
                    filesApiFetchStub,
                    `https://test.com/files-api/v2/projects/${projectId}/files/zip`,
                    {
                        headers: {
                            Authorization: "test_token_type test_access_token",
                            "Content-Type": "application/json",
                            "User-Agent": "test_user_agent"
                        },
                        method: "post",
                        body: JSON.stringify({
                            files: [{
                                fileUri,
                                localeIds: [localeId, anotherLocaleId]
                            }]
                        })
                    }
                );
            });

            it("Download mutliple files translations with parameters", async () => {
                params
                    .setRetrievalType(RetrievalType.PUBLISHED)
                    .includeOriginalStrings()
                    .setFileNameMode(TranslationFileNameMode.UNCHANGED)
                    .setFileLocaleMode(FileLocaleMode.LOCALE_IN_PATH)
                    .setZipFileName("translations.zip")
                    .setFileFilter(FileFilter.ALL_FILES);

                await filesApi.downloadMultipleFilesTranslations(
                    projectId,
                    params
                );

                sinon.assert.calledOnce(filesApiFetchStub);
                sinon.assert.calledWithExactly(
                    filesApiFetchStub,
                    `https://test.com/files-api/v2/projects/${projectId}/files/zip`,
                    {
                        headers: {
                            Authorization: "test_token_type test_access_token",
                            "Content-Type": "application/json",
                            "User-Agent": "test_user_agent"
                        },
                        method: "post",
                        body: JSON.stringify({
                            files: [{
                                fileUri,
                                localeIds: [localeId, anotherLocaleId]
                            }],
                            retrievalType: "published",
                            includeOriginalStrings: true,
                            fileNameMode: "unchanged",
                            localeMode: "locale_in_path",
                            zipFileName: "translations.zip",
                            fileFilter: "all_files"
                        })
                    }
                );
            });
        });
    });
});
