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
    });

    afterEach(() => {
        fileTranslationsApiFetchStub.restore();
        fileTranslationsApiUaStub.restore();
        responseMockJsonStub.restore();
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
                accountUid, fileUid, mtUid, localeId);

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

            const downloadMock = {
                status: 200,
                arrayBuffer: async (): Promise<ArrayBuffer> => new ArrayBuffer(1),
                headers: {
                    "content-type": "application/xml",
                    "content-disposition": "attachment; filename=\"test.xml\""
                }
            };
            fileTranslationsApiFetchStub.returns(downloadMock);

            const fileWithMetadata = await fileTranslationsApi.downloadTranslatedFileWithMetadata(
                accountUid, fileUid, mtUid, localeId);

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
                accountUid, fileUid, mtUid);

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
            const downloadMock = {
                status: 200,
                arrayBuffer: async (): Promise<ArrayBuffer> => new ArrayBuffer(1),
                headers: {
                    "content-type": "application/zip",
                    "content-disposition": "attachment; filename=\"test.zip\""
                }
            };
            fileTranslationsApiFetchStub.returns(downloadMock);

            const fileWithMetadata = await fileTranslationsApi.downloadTranslatedFilesWithMetadata(
                accountUid, fileUid, mtUid);

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
