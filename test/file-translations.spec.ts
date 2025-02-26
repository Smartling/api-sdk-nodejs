import assert from "assert";
import FormData from "form-data";
import fs from "fs";
import sinon from "sinon";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingFileTranslationsApi } from "../api/file-translations";
import { SmartlingAuthApi } from "../api/auth";
import { FtsUploadFileParameters } from "../api/file-translations/params/fts-upload-file-parameters";
import { FileType } from "../api/files/params/file-type";
import { streamToString } from "./stream-to-string";
import { TranslateFileParameters } from "../api/file-translations/params/translate-file-parameters";
import { FtsCallbackMethod } from "../api/file-translations/params/fts-callback-parameter";
import { LanguageDetectionParameters } from "../api/file-translations/params/language-detection-parameters";

describe("SmartlingFileTranslationsApi class tests.", () => {
    const userAgent = "test_user_agent";
    const accountUid = "testAccountUid";
    const fileUid = "testFileUid";
    const mtUid = "testMtUid";
    const languageDetectionUid = "testLanguageDetectionUid";

    let fileTranslationsApi: SmartlingFileTranslationsApi;
    let fileTranslationsApiFetchStub;
    let fileTranslationsApiUaStub;
    let responseMockJsonStub;
    let getHeaderStub;

    beforeEach(() => {
        fileTranslationsApi = new SmartlingFileTranslationsApi(
            "https://test.com",
            authMock as unknown as SmartlingAuthApi,
            loggerMock
        );
        fileTranslationsApiFetchStub = sinon.stub(fileTranslationsApi, "fetch");
        fileTranslationsApiUaStub = sinon.stub(fileTranslationsApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        fileTranslationsApiFetchStub.returns(responseMock);
        fileTranslationsApiUaStub.returns(userAgent);
        responseMockJsonStub.returns({
            response: {}
        });
        getHeaderStub = sinon.stub(responseMock.headers, "get");
        getHeaderStub.returns(null);
    });

    afterEach(() => {
        fileTranslationsApiFetchStub.restore();
        fileTranslationsApiUaStub.restore();
        responseMockJsonStub.restore();
        getHeaderStub.restore();
    });

    describe("Methods", () => {
        it("Upload file: from disk", async () => {
            const params = new FtsUploadFileParameters();

            params
                .setFileType(FileType.XML)
                .setFileFromLocalFilePath("./test/data/file.xml");

            await fileTranslationsApi.uploadFile(accountUid, params);

            sinon.assert.calledOnce(fileTranslationsApiFetchStub);

            const fileTranslationsApiFetchCall = fileTranslationsApiFetchStub.getCall(0);

            assert.equal(
                fileTranslationsApiFetchCall.args[0],
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files`
            );

            assert.equal(
                fileTranslationsApiFetchCall.args[1].method,
                "post"
            );

            assert.equal(
                fileTranslationsApiFetchCall.args[1].headers.Authorization,
                "test_token_type test_access_token"
            );

            const testFileContent = fs.readFileSync(
                fs.realpathSync("./test/data/file.xml"),
                "utf8"
            );

            const formData = fileTranslationsApiFetchCall.args[1].body as FormData;
            const boundary = formData.getBoundary();

            assert.equal(fileTranslationsApiFetchCall.args[1].headers["User-Agent"], userAgent);
            assert.equal(fileTranslationsApiFetchCall.args[1].headers["Content-Type"], `multipart/form-data; boundary=${boundary}`);

            const content = await streamToString(
                // eslint-disable-next-line no-underscore-dangle
                fileTranslationsApiFetchCall.args[1].body._streams[1]
            );
            assert.equal(content, testFileContent);

            // eslint-disable-next-line no-underscore-dangle
            assert.equal(fileTranslationsApiFetchCall.args[1].body._streams[4], "{\"fileType\":\"XML\"}");
        });

        it("Upload file: as string", async () => {
            const params = new FtsUploadFileParameters();

            const testFileContent = fs.readFileSync(
                fs.realpathSync("./test/data/file.xml"),
                "utf8"
            );

            params
                .setFileType(FileType.XML)
                .setFileContent(testFileContent);

            await fileTranslationsApi.uploadFile(accountUid, params);

            sinon.assert.calledOnce(fileTranslationsApiFetchStub);

            const fileTranslationsApiFetchCall = fileTranslationsApiFetchStub.getCall(0);

            assert.equal(
                fileTranslationsApiFetchCall.args[0],
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files`
            );

            assert.equal(
                fileTranslationsApiFetchCall.args[1].method,
                "post"
            );

            assert.equal(
                fileTranslationsApiFetchCall.args[1].headers.Authorization,
                "test_token_type test_access_token"
            );

            const formData = fileTranslationsApiFetchCall.args[1].body as FormData;
            const boundary = formData.getBoundary();

            assert.equal(fileTranslationsApiFetchCall.args[1].headers["User-Agent"], userAgent);
            assert.equal(fileTranslationsApiFetchCall.args[1].headers["Content-Type"], `multipart/form-data; boundary=${boundary}`);

            const content = await streamToString(
                // eslint-disable-next-line no-underscore-dangle
                fileTranslationsApiFetchCall.args[1].body._streams[1]
            );
            assert.equal(content, testFileContent);

            // eslint-disable-next-line no-underscore-dangle
            assert.equal(fileTranslationsApiFetchCall.args[1].body._streams[4], "{\"fileType\":\"XML\"}");
        });

        it("Upload file: as binary buffer", async () => {
            const params = new FtsUploadFileParameters();

            const testFileContent = fs.readFileSync(
                fs.realpathSync("./test/data/file.xml")
            );

            params
                .setFileType(FileType.XML)
                .setFileContentFromBuffer(testFileContent);

            await fileTranslationsApi.uploadFile(accountUid, params);

            sinon.assert.calledOnce(fileTranslationsApiFetchStub);

            const fileTranslationsApiFetchCall = fileTranslationsApiFetchStub.getCall(0);

            assert.equal(
                fileTranslationsApiFetchCall.args[0],
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files`
            );

            assert.equal(
                fileTranslationsApiFetchCall.args[1].method,
                "post"
            );

            assert.equal(
                fileTranslationsApiFetchCall.args[1].headers.Authorization,
                "test_token_type test_access_token"
            );

            const formData = fileTranslationsApiFetchCall.args[1].body as FormData;
            const boundary = formData.getBoundary();

            assert.equal(fileTranslationsApiFetchCall.args[1].headers["User-Agent"], userAgent);
            assert.equal(fileTranslationsApiFetchCall.args[1].headers["Content-Type"], `multipart/form-data; boundary=${boundary}`);

            // eslint-disable-next-line no-underscore-dangle
            const content = fileTranslationsApiFetchCall.args[1].body._streams[1].toString("utf-8");
            assert.equal(content, testFileContent);

            // eslint-disable-next-line no-underscore-dangle
            assert.equal(fileTranslationsApiFetchCall.args[1].body._streams[4], "{\"fileType\":\"XML\"}");
        });

        it("Upload file: with file name", async () => {
            const params = new FtsUploadFileParameters();

            const testFileContent = fs.readFileSync(
                fs.realpathSync("./test/data/file.xml")
            );

            params
                .setFileType(FileType.XML)
                .setFileContentFromBuffer(testFileContent)
                .setFileName("my-file");

            await fileTranslationsApi.uploadFile(accountUid, params);

            sinon.assert.calledOnce(fileTranslationsApiFetchStub);

            const fileTranslationsApiFetchCall = fileTranslationsApiFetchStub.getCall(0);

            assert.equal(
                fileTranslationsApiFetchCall.args[0],
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files`
            );

            assert.equal(
                fileTranslationsApiFetchCall.args[1].method,
                "post"
            );

            assert.equal(
                fileTranslationsApiFetchCall.args[1].headers.Authorization,
                "test_token_type test_access_token"
            );

            const formData = fileTranslationsApiFetchCall.args[1].body as FormData;
            const boundary = formData.getBoundary();

            assert.equal(fileTranslationsApiFetchCall.args[1].headers["User-Agent"], userAgent);
            assert.equal(fileTranslationsApiFetchCall.args[1].headers["Content-Type"], `multipart/form-data; boundary=${boundary}`);

            // eslint-disable-next-line no-underscore-dangle
            const content = fileTranslationsApiFetchCall.args[1].body._streams[1].toString("utf-8");
            assert.equal(content, testFileContent);

            // eslint-disable-next-line no-underscore-dangle
            const contentDisposition = fileTranslationsApiFetchCall.args[1].body._streams[0].toString("utf-8");

            assert.ok(contentDisposition.includes("filename=\"my-file\""));
            assert.ok(contentDisposition.includes("Content-Type: application/octet-stream"));

            // eslint-disable-next-line no-underscore-dangle
            assert.equal(fileTranslationsApiFetchCall.args[1].body._streams[4], "{\"fileType\":\"XML\"}");
        });

        it("Upload file: with file content type", async () => {
            const params = new FtsUploadFileParameters();

            const testFileContent = fs.readFileSync(
                fs.realpathSync("./test/data/file.xml")
            );

            params
                .setFileType(FileType.XML)
                .setFileContentFromBuffer(testFileContent)
                .setFileContentType("application/xml");

            await fileTranslationsApi.uploadFile(accountUid, params);

            sinon.assert.calledOnce(fileTranslationsApiFetchStub);

            const fileTranslationsApiFetchCall = fileTranslationsApiFetchStub.getCall(0);

            assert.equal(
                fileTranslationsApiFetchCall.args[0],
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files`
            );

            assert.equal(
                fileTranslationsApiFetchCall.args[1].method,
                "post"
            );

            assert.equal(
                fileTranslationsApiFetchCall.args[1].headers.Authorization,
                "test_token_type test_access_token"
            );

            const formData = fileTranslationsApiFetchCall.args[1].body as FormData;
            const boundary = formData.getBoundary();

            assert.equal(fileTranslationsApiFetchCall.args[1].headers["User-Agent"], userAgent);
            assert.equal(fileTranslationsApiFetchCall.args[1].headers["Content-Type"], `multipart/form-data; boundary=${boundary}`);

            // eslint-disable-next-line no-underscore-dangle
            const content = fileTranslationsApiFetchCall.args[1].body._streams[1].toString("utf-8");
            assert.equal(content, testFileContent);

            // eslint-disable-next-line no-underscore-dangle
            const contentDisposition = fileTranslationsApiFetchCall.args[1].body._streams[0].toString("utf-8");

            assert.ok(!contentDisposition.includes("filename="));
            assert.ok(contentDisposition.includes("Content-Type: application/xml"));

            // eslint-disable-next-line no-underscore-dangle
            assert.equal(fileTranslationsApiFetchCall.args[1].body._streams[4], "{\"fileType\":\"XML\"}");
        });

        it("Translate file", async () => {
            const params = new TranslateFileParameters();

            params
                .setSourceLocaleId("en-US")
                .setTargetLocaleIds(["de-DE", "fr-FR"]);

            await fileTranslationsApi.translateFile(accountUid, fileUid, params);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    },
                    body: JSON.stringify({
                        sourceLocaleId: "en-US",
                        targetLocaleIds: ["de-DE", "fr-FR"]
                    })
                }
            );
        });

        it("Translate file with callback specified by URL only", async () => {
            const params = new TranslateFileParameters();

            params
                .setSourceLocaleId("en-US")
                .setTargetLocaleIds(["de-DE", "fr-FR"])
                .setCallback("https://myhost.com");

            await fileTranslationsApi.translateFile(accountUid, fileUid, params);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    },
                    body: JSON.stringify({
                        sourceLocaleId: "en-US",
                        targetLocaleIds: ["de-DE", "fr-FR"],
                        callback: {
                            url: "https://myhost.com",
                            httpMethod: "POST"
                        }
                    })
                }
            );
        });

        it("Translate file with callback specified by URL and method", async () => {
            const params = new TranslateFileParameters();

            params
                .setSourceLocaleId("en-US")
                .setTargetLocaleIds(["de-DE", "fr-FR"])
                .setCallback("https://myhost.com", FtsCallbackMethod.GET);

            await fileTranslationsApi.translateFile(accountUid, fileUid, params);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    },
                    body: JSON.stringify({
                        sourceLocaleId: "en-US",
                        targetLocaleIds: ["de-DE", "fr-FR"],
                        callback: {
                            url: "https://myhost.com",
                            httpMethod: "GET"
                        }
                    })
                }
            );
        });

        it("Translate file with callback with user data", async () => {
            const params = new TranslateFileParameters();

            params
                .setSourceLocaleId("en-US")
                .setTargetLocaleIds(["de-DE", "fr-FR"])
                .setCallback("https://myhost.com", FtsCallbackMethod.POST, { key1: "value", key2: 45 });

            await fileTranslationsApi.translateFile(accountUid, fileUid, params);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    },
                    body: JSON.stringify({
                        sourceLocaleId: "en-US",
                        targetLocaleIds: ["de-DE", "fr-FR"],
                        callback: {
                            url: "https://myhost.com",
                            httpMethod: "POST",
                            userData: {
                                key1: "value",
                                key2: 45
                            }
                        }
                    })
                }
            );
        });

        it("Translate file with callback object", async () => {
            const callback = {
                url: "https://myhost.com",
                httpMethod: FtsCallbackMethod.GET,
                userData: {
                    key1: 67,
                    key2: true
                }
            };

            const params = new TranslateFileParameters();

            params
                .setSourceLocaleId("en-US")
                .setTargetLocaleIds(["de-DE", "fr-FR"])
                .setCallback(callback);

            await fileTranslationsApi.translateFile(accountUid, fileUid, params);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    },
                    body: JSON.stringify({
                        sourceLocaleId: "en-US",
                        targetLocaleIds: ["de-DE", "fr-FR"],
                        callback: {
                            url: "https://myhost.com",
                            httpMethod: "GET",
                            userData: {
                                key1: 67,
                                key2: true
                            }
                        }
                    })
                }
            );
        });

        it("Get translation progress", async () => {
            await fileTranslationsApi.getTranslationProgress(accountUid, fileUid, mtUid);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt/${mtUid}/status`,
                {
                    method: "get",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    }
                }
            );
        });

        it("Download translated file", async () => {
            const localeId = "de-DE";

            await fileTranslationsApi.downloadTranslatedFile(accountUid, fileUid, mtUid, localeId);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt/${mtUid}/locales/${localeId}/file`,
                {
                    method: "get",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    }
                }
            );
        });

        it("Download translated file with metadata when no headers", async () => {
            const localeId = "de-DE";

            const fileWithMetadata = await fileTranslationsApi.downloadTranslatedFileWithMetadata(
                accountUid, fileUid, mtUid, localeId
            );

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt/${mtUid}/locales/${localeId}/file`,
                {
                    method: "get",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    }
                }
            );

            assert.ok(fileWithMetadata.contentType === undefined);
            assert.ok(fileWithMetadata.fileName === undefined);
            assert.ok(fileWithMetadata.fileContent.byteLength === 1);
        });

        it("Download translated file with metadata", async () => {
            const localeId = "de-DE";

            getHeaderStub.onCall(0).returns("application/xml");
            getHeaderStub.onCall(1).returns("attachment; filename=\"test.xml\"");
            getHeaderStub.returns(null);

            const fileWithMetadata = await fileTranslationsApi.downloadTranslatedFileWithMetadata(
                accountUid, fileUid, mtUid, localeId
            );

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt/${mtUid}/locales/${localeId}/file`,
                {
                    method: "get",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    }
                }
            );

            assert.ok(fileWithMetadata.contentType === "application/xml");
            assert.ok(fileWithMetadata.fileName === "test.xml");
            assert.ok(fileWithMetadata.fileContent.byteLength === 1);
        });

        it("Download translated file with escaped quotes in the file name", async () => {
            const localeId = "de-DE";

            getHeaderStub.onCall(0).returns("application/xml");
            getHeaderStub.onCall(1).returns("attachment; filename=\"test - \\\"phase 1\\\".xml\"");
            getHeaderStub.returns(null);

            const fileWithMetadata = await fileTranslationsApi.downloadTranslatedFileWithMetadata(
                accountUid, fileUid, mtUid, localeId
            );

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt/${mtUid}/locales/${localeId}/file`,
                {
                    method: "get",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    }
                }
            );

            assert.ok(fileWithMetadata.contentType === "application/xml");
            assert.ok(fileWithMetadata.fileName === "test - \"phase 1\".xml");
            assert.ok(fileWithMetadata.fileContent.byteLength === 1);
        });

        it("Download translated files", async () => {
            await fileTranslationsApi.downloadTranslatedFiles(accountUid, fileUid, mtUid);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt/${mtUid}/locales/all/file/zip`,
                {
                    method: "get",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    }
                }
            );
        });

        it("Download translated files with metadata when no headers", async () => {
            const fileWithMetadata = await fileTranslationsApi.downloadTranslatedFilesWithMetadata(
                accountUid, fileUid, mtUid
            );

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt/${mtUid}/locales/all/file/zip`,
                {
                    method: "get",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    }
                }
            );

            assert.ok(fileWithMetadata.contentType === undefined);
            assert.ok(fileWithMetadata.fileName === undefined);
            assert.ok(fileWithMetadata.fileContent.byteLength === 1);
        });

        it("Download translated files with metadata", async () => {
            getHeaderStub.onCall(0).returns("application/zip");
            getHeaderStub.onCall(1).returns("attachment; filename=\"test.zip\"");
            getHeaderStub.returns(null);

            const fileWithMetadata = await fileTranslationsApi.downloadTranslatedFilesWithMetadata(
                accountUid, fileUid, mtUid
            );

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt/${mtUid}/locales/all/file/zip`,
                {
                    method: "get",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    }
                }
            );

            assert.ok(fileWithMetadata.contentType === "application/zip");
            assert.ok(fileWithMetadata.fileName === "test.zip");
            assert.ok(fileWithMetadata.fileContent.byteLength === 1);
        });

        it("Cancel file translation", async () => {
            await fileTranslationsApi.cancelFileTranslation(accountUid, fileUid, mtUid);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/mt/${mtUid}/cancel`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    }
                }
            );
        });

        it("Detect file language", async () => {
            await fileTranslationsApi.detectFileLanguage(accountUid, fileUid);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/language-detection`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    }
                }
            );
        });

        it("Detect file language with empty parameters", async () => {
            await fileTranslationsApi.detectFileLanguage(
                accountUid, fileUid, new LanguageDetectionParameters()
            );

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/language-detection`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    },
                    body: JSON.stringify({})
                }
            );
        });

        it("Detect file language with callback specified by URL only", async () => {
            const params = new LanguageDetectionParameters()
                .setCallback("https://myhost.com");

            await fileTranslationsApi.detectFileLanguage(accountUid, fileUid, params);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/language-detection`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    },
                    body: JSON.stringify({
                        callback: {
                            url: "https://myhost.com",
                            httpMethod: "POST"
                        }
                    })
                }
            );
        });

        it("Detect file language with callback specified by URL and method", async () => {
            const params = new LanguageDetectionParameters()
                .setCallback("https://myhost.com", FtsCallbackMethod.GET);

            await fileTranslationsApi.detectFileLanguage(accountUid, fileUid, params);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/language-detection`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    },
                    body: JSON.stringify({
                        callback: {
                            url: "https://myhost.com",
                            httpMethod: "GET"
                        }
                    })
                }
            );
        });

        it("Detect file language with callback with user data", async () => {
            const params = new LanguageDetectionParameters()
                .setCallback("https://myhost.com", FtsCallbackMethod.POST, { key1: "value", key2: true });

            await fileTranslationsApi.detectFileLanguage(accountUid, fileUid, params);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/language-detection`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    },
                    body: JSON.stringify({
                        callback: {
                            url: "https://myhost.com",
                            httpMethod: "POST",
                            userData: {
                                key1: "value",
                                key2: true
                            }
                        }
                    })
                }
            );
        });

        it("Detect file language with callback object", async () => {
            const callback = {
                url: "https://myhost.com",
                httpMethod: FtsCallbackMethod.GET,
                userData: {
                    key1: 78,
                    key2: "value"
                }
            };

            const params = new LanguageDetectionParameters()
                .setCallback(callback);

            await fileTranslationsApi.detectFileLanguage(accountUid, fileUid, params);

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/language-detection`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    },
                    body: JSON.stringify({
                        callback: {
                            url: "https://myhost.com",
                            httpMethod: "GET",
                            userData: {
                                key1: 78,
                                key2: "value"
                            }
                        }
                    })
                }
            );
        });

        it("Get language detection progress", async () => {
            await fileTranslationsApi.getLanguageDetectionProgress(
                accountUid,
                fileUid,
                languageDetectionUid
            );

            sinon.assert.calledOnceWithExactly(
                fileTranslationsApiFetchStub,
                `https://test.com/file-translations-api/v2/accounts/${accountUid}/files/${fileUid}/language-detection/${languageDetectionUid}/status`,
                {
                    method: "get",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": userAgent
                    }
                }
            );
        });
    });
});
