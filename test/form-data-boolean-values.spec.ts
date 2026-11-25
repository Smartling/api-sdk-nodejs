import assert from "assert";
import http from "http";
import { AddressInfo } from "net";
import { loggerMock, authMock } from "./mock";
import { SmartlingAuthApi } from "../api/auth/index";
import { SmartlingFilesApi } from "../api/files/index";
import { SmartlingGlossariesApi } from "../api/glossaries/index";
import { SmartlingJobBatchesApi } from "../api/job-batches/index";
import { SmartlingTranslationMemoryApi } from "../api/translation-memory/index";
import { SmartlingContextApi } from "../api/context/index";
import { UploadFileParameters } from "../api/files/params/upload-file-parameters";
import { ImportFileParameters } from "../api/files/params/import-file-parameters";
import { InitializeImportParameters } from "../api/glossaries/params/initialize-import-parameters";
import { UploadBatchFileParameters } from "../api/job-batches/params/upload-batch-file-parameters";
import { ImportTmxFileParameters } from "../api/translation-memory/params/import-tmx-file-parameters";
import { ContextUploadParameters } from "../api/context/params/context-upload-parameters";
import { FileType } from "../api/files/params/file-type";

describe("Boolean values in multipart form requests", () => {
    let server: http.Server;
    let baseUrl: string;
    let lastRequestBody: string;

    const auth = authMock as unknown as SmartlingAuthApi;

    before(async () => {
        server = http.createServer((request, response) => {
            const chunks: Buffer[] = [];

            // eslint-disable-next-line fp/no-mutating-methods
            request.on("data", (chunk) => chunks.push(chunk));
            request.on("end", () => {
                lastRequestBody = Buffer.concat(chunks).toString();
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify({ response: { code: "SUCCESS", data: {} } }));
            });
        });

        await new Promise<void>((resolve) => {
            server.listen(0, "127.0.0.1", resolve);
        });
        baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    after(() => {
        server.close();
    });

    function assertFieldSent(name: string, value: string): void {
        assert.ok(
            lastRequestBody.includes(`name="${name}"\r\n\r\n${value}\r\n`),
            `Expected field ${name}=${value} in request body, got:\n${lastRequestBody}`
        );
    }

    [true, false].forEach((value) => {
        describe(`value ${value}`, () => {
            it("glossaries: initializeGlossaryImport sends archiveMode", async () => {
                const api = new SmartlingGlossariesApi(baseUrl, auth, loggerMock);
                const params = new InitializeImportParameters()
                    .setArchiveMode(value)
                    .setImportFileContentFromBuffer(Buffer.from("term"))
                    .setImportFileName("terms.csv");

                await api.initializeGlossaryImport("accountUid", "glossaryUid", params);

                assertFieldSent("archiveMode", String(value));
            });

            it("files: importFile sends overwrite", async () => {
                const api = new SmartlingFilesApi(baseUrl, auth, loggerMock);
                const params = new ImportFileParameters()
                    .setFileContent("content")
                    .setFileUri("file.json")
                    .setFileType(FileType.JSON);

                params.set("overwrite", value);
                await api.importFile("projectId", "fr-FR", params);

                assertFieldSent("overwrite", String(value));
            });

            it("files: uploadFile sends boolean parameter", async () => {
                const api = new SmartlingFilesApi(baseUrl, auth, loggerMock);
                const params = new UploadFileParameters()
                    .setFileContent("content")
                    .setFileUri("file.json")
                    .setFileType(FileType.JSON);

                params.set("flag", value);
                await api.uploadFile("projectId", params);

                assertFieldSent("flag", String(value));
            });

            it("job-batches: uploadBatchFile sends boolean parameter", async () => {
                const api = new SmartlingJobBatchesApi(baseUrl, auth, loggerMock);
                const params = new UploadBatchFileParameters()
                    .setFileContentFromBuffer(Buffer.from("content"))
                    .setFileUri("file.json")
                    .setFileType(FileType.JSON);

                params.set("flag", value);
                await api.uploadBatchFile("projectId", "batchUid", params);

                assertFieldSent("flag", String(value));
            });

            it("translation-memory: importTmxFile sends boolean parameter", async () => {
                const api = new SmartlingTranslationMemoryApi(baseUrl, auth, loggerMock);
                const params = new ImportTmxFileParameters()
                    .setFileContentFromBuffer(Buffer.from("<tmx/>"))
                    .setFileUri("memory.tmx");

                params.set("flag", value);
                await api.importTmxFile("accountUid", params);

                assertFieldSent("flag", String(value));
            });

            it("context: upload sends boolean parameter", async () => {
                const api = new SmartlingContextApi(baseUrl, auth, loggerMock);
                const params = new ContextUploadParameters().setContent("<html/>");

                params.set("flag", value);
                await api.upload("projectId", params);

                assertFieldSent("flag", String(value));
            });
        });
    });
});
