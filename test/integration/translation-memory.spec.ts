import dotenv from "dotenv";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../../api/builder/index";
import { SmartlingTranslationMemoryApi } from "../../api/translation-memory/index";
import { ImportTmxFileParameters } from "../../api/translation-memory/params/import-tmx-file-parameters";
import { CreateStringSearchFilterParameters } from "../../api/translation-memory/params/create-string-search-filter-parameters";
import { BulkExportTmStringsParameters } from "../../api/translation-memory/params/bulk-export-tm-strings-parameters";
import { CreateTmParameters } from "../../api/translation-memory/params/create-tm-parameters";
import { UpdateTmParameters } from "../../api/translation-memory/params/update-tm-parameters";
import { TranslationQualityType } from "../../api/translation-memory/params/translation-quality-type";

dotenv.config();

const baseSmartlingApiUrl = process.env.SMARTLING_API_BASE_URL || "https://api.smartling.com";
const accountUid = process.env.SMARTLING_ACCOUNT_UID as string;
const userId = process.env.SMARTLING_USER_ID as string;
const userSecret = process.env.SMARTLING_USER_SECRET as string;
const hasCredentials = Boolean(accountUid && userId && userSecret);
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
    let tmUid: string;

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping Translation Memory integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET in .env");
            this.skip();
        }

        api = new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret)
            .build(SmartlingTranslationMemoryApi);
    });

    before(async () => {
        const created = await api.createTm(
            accountUid,
            new CreateTmParameters()
                .setName(`api-sdk-nodejs integration test TM ${Date.now()}`)
                .setDescription("Created by the api-sdk-nodejs integration suite")
                .setSourceLocaleId("en-US")
                .setTranslationQuality(TranslationQualityType.TRANSLATION)
        );

        logResponse("createTm", created);
        ({ tmUid } = created);
    });

    after(async () => {
        if (tmUid) {
            const deleted = await api.deleteTm(accountUid, tmUid);

            logResponse("deleteTm (cleanup)", deleted);
        }
    });

    it("Updates the TM", async () => {
        const updated = await api.updateTm(
            accountUid,
            new UpdateTmParameters()
                .setTmUid(tmUid)
                .setName(`api-sdk-nodejs integration test TM (updated) ${Date.now()}`)
                .setDescription("Updated by the api-sdk-nodejs integration suite")
        );

        logResponse("updateTm", updated);

        assert.equal(updated.tmUid, tmUid);
        assert.ok(updated.created instanceof Date);
        assert.ok(updated.lastModified instanceof Date);
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
        // A just-imported TMX string isn't immediately searchable: createStringSearch can
        // briefly return stringCount: 0 right after import, so retry until it's indexed.
        const searchFilter = new CreateStringSearchFilterParameters().setTmUids([tmUid]);
        let searchResult = await api.createStringSearch(accountUid, searchFilter);
        const searchDeadline = Date.now() + 30000;

        while (!searchResult.stringCount && Date.now() < searchDeadline) {
            /* eslint-disable-next-line no-await-in-loop */
            await delay(2000);
            /* eslint-disable-next-line no-await-in-loop */
            searchResult = await api.createStringSearch(accountUid, searchFilter);
        }

        logResponse("createStringSearch", searchResult);
        assert.ok(searchResult.searchUid);
        assert.ok(searchResult.stringCount);

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
