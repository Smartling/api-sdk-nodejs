import dotenv from "dotenv";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../../api/builder/index";
import { SmartlingTranslationMemoryApi } from "../../api/translation-memory/index";
import { ImportTmxFileParameters } from "../../api/translation-memory/params/import-tmx-file-parameters";
import { CreateStringSearchFilterParameters } from "../../api/translation-memory/params/create-string-search-filter-parameters";
import { BulkExportTmStringsParameters } from "../../api/translation-memory/params/bulk-export-tm-strings-parameters";

dotenv.config();

const baseSmartlingApiUrl = process.env.SMARTLING_API_BASE_URL || "https://api.smartling.com";
const accountUid = process.env.SMARTLING_ACCOUNT_UID as string;
const userId = process.env.SMARTLING_USER_ID as string;
const userSecret = process.env.SMARTLING_USER_SECRET as string;
const tmUid = process.env.SMARTLING_TM_UID as string;
const hasCredentials = Boolean(accountUid && userId && userSecret && tmUid);
const logResponsesEnabled = process.env.SMARTLING_LOG_RESPONSES === "true";

function logResponse(label: string, response: unknown): void {
    if (!logResponsesEnabled) {
        return;
    }

    // eslint-disable-next-line no-console
    console.log(`\n--- ${label} ---\n${JSON.stringify(response, null, 2)}`);
}

function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

describe("SmartlingTranslationMemoryApi integration tests.", function integrationSuite() {
    this.timeout(120000);

    let api: SmartlingTranslationMemoryApi;

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping Translation Memory integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET, SMARTLING_TM_UID in .env");
            this.skip();
        }

        api = new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret)
            .build(SmartlingTranslationMemoryApi);
    });

    it("Imports a TMX file", async () => {
        const result = await api.importTmxFile(
            accountUid,
            new ImportTmxFileParameters()
                .setFileFromLocalFilePath("./test/data/sample.tmx")
                .setFileUri(`integration-test-${Date.now()}.tmx`)
                .setTmUid(tmUid)
                .setDescription("api-sdk-nodejs integration test import")
        );

        logResponse("importTmxFile", result);

        assert.ok(result.jobUid);
        assert.ok(result.tmxUid);
        assert.equal(typeof result.stringCount, "number");
        assert.equal(typeof result.wordCount, "number");
    });

    it("Creates a string search, bulk-exports it, polls status, and downloads the TMX", async () => {
        const searchResult = await api.createStringSearch(
            accountUid,
            new CreateStringSearchFilterParameters().setTmUids([tmUid])
        );

        logResponse("createStringSearch", searchResult);
        assert.ok(searchResult.searchUid);

        const exportResult = await api.bulkExportTmStrings(
            accountUid,
            new BulkExportTmStringsParameters().setSearchUid(searchResult.searchUid)
        );

        logResponse("bulkExportTmStrings", exportResult);
        assert.ok(exportResult.actionUid);

        let status = await api.getBulkExportTmStringsStatus(accountUid, exportResult.actionUid);
        const deadline = Date.now() + 90000;

        while (!status.executionComplete && Date.now() < deadline) {
            /* eslint-disable-next-line no-await-in-loop */
            await delay(2000);
            /* eslint-disable-next-line no-await-in-loop */
            status = await api.getBulkExportTmStringsStatus(accountUid, exportResult.actionUid);
        }

        logResponse("getBulkExportTmStringsStatus", status);
        assert.equal(status.executionComplete, true);

        if (status.tmxDownloadKey) {
            const downloaded = await api.downloadTmxFile(accountUid, status.tmxDownloadKey);

            logResponse("downloadTmxFile", {
                fileName: downloaded.fileName,
                contentType: downloaded.contentType,
                byteLength: downloaded.fileContent.byteLength
            });

            assert.ok(downloaded.fileContent.byteLength > 0);
        }
    });
});
