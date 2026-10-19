import dotenv from "dotenv";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../../api/builder/index";
import { SmartlingTranslationMemoryApi } from "../../api/translation-memory/index";
import { ImportTmxFileParameters } from "../../api/translation-memory/params/import-tmx-file-parameters";
import { CreateStringSearchFilterParameters } from "../../api/translation-memory/params/create-string-search-filter-parameters";
import { BulkExportTmStringsParameters } from "../../api/translation-memory/params/bulk-export-tm-strings-parameters";
import { CreateTmParameters } from "../../api/translation-memory/params/create-tm-parameters";
import { UpdateTmParameters } from "../../api/translation-memory/params/update-tm-parameters";
import { SearchTmsParameters } from "../../api/translation-memory/params/search-tms-parameters";
import { TmSorting } from "../../api/translation-memory/params/tm-sorting";
import { TranslationQualityType } from "../../api/translation-memory/params/translation-quality-type";
import { logResponse } from "./helpers/log-response";

dotenv.config();

const baseSmartlingApiUrl = process.env.SMARTLING_API_BASE_URL || "https://api.smartling.com";
const accountUid = process.env.SMARTLING_ACCOUNT_UID as string;
const userId = process.env.SMARTLING_USER_ID as string;
const userSecret = process.env.SMARTLING_USER_SECRET as string;
const hasCredentials = Boolean(accountUid && userId && userSecret);

function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

describe("SmartlingTranslationMemoryApi integration tests.", function integrationSuite() {
    // The export test's two polling loops (search-indexing + export-status) can each run close
    // to their own deadline back to back, plus real network latency on top - give enough room
    // that Mocha's own timeout doesn't fire before those loops give up on their own.
    this.timeout(240000);

    let api: SmartlingTranslationMemoryApi;
    let tmUid: string;
    let tmName: string;

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
        tmName = `api-sdk-nodejs integration test TM ${Date.now()}`;

        const created = await api.createTm(
            accountUid,
            new CreateTmParameters()
                .setName(tmName)
                .setDescription("Created by the api-sdk-nodejs integration suite")
                .setSourceLocaleId("en-US")
                .setTranslationQuality(TranslationQualityType.TRANSLATION)
        );

        logResponse("createTm", created);
        assert.ok(created, "createTm returned null");
        ({ tmUid } = created);
    });

    after(async () => {
        if (tmUid) {
            const deleted = await api.deleteTm(accountUid, tmUid);

            logResponse("deleteTm (cleanup)", deleted);
        }
    });

    it("Updates the TM", async () => {
        const updatedName = `api-sdk-nodejs integration test TM (updated) ${Date.now()}`;
        const updatedDescription = "Updated by the api-sdk-nodejs integration suite";

        const updated = await api.updateTm(
            accountUid,
            new UpdateTmParameters()
                .setTmUid(tmUid)
                .setName(updatedName)
                .setDescription(updatedDescription)
        );

        logResponse("updateTm", updated);

        assert.ok(updated, "updateTm returned null");
        assert.equal(updated.tmUid, tmUid);
        assert.equal(updated.name, updatedName);
        assert.equal(updated.description, updatedDescription);
        assert.ok(updated.created instanceof Date);
        assert.ok(updated.lastModified instanceof Date);

        // Keep tmName in sync with the TM's current name so a later nameFilter-based
        // searchTms lookup (see "Finds the TM via searchTms") matches the renamed TM.
        tmName = updatedName;
    });

    it("Gets the TM by UID", async () => {
        const fetched = await api.getTm(accountUid, tmUid);

        logResponse("getTm", fetched);

        assert.ok(fetched, "getTm returned null");
        assert.equal(fetched.tmUid, tmUid);
        assert.ok(fetched.created instanceof Date);
        assert.ok(fetched.lastModified instanceof Date);
    });

    it("Finds the TM via searchTms", async () => {
        // Captured as a const so the polling loop's closure below doesn't trip no-loop-func.
        const expectedTmUid = tmUid;
        const searchParams = (): SearchTmsParameters => new SearchTmsParameters()
            .setSourceLocaleId("en-US")
            .setNameFilter(tmName)
            .setSortBy(TmSorting.BY_NAME_ASC)
            .setFirst(50);

        // A just-created TM can briefly miss nameFilter-based search before it's indexed,
        // so retry until it shows up or the deadline passes.
        let found = await api.searchTms(accountUid, searchParams());
        const deadline = Date.now() + 30000;

        while (
            !found?.some((tm) => tm.tmUid === expectedTmUid)
            && Date.now() < deadline
        ) {
            /* eslint-disable-next-line no-await-in-loop */
            await delay(2000);
            /* eslint-disable-next-line no-await-in-loop */
            found = await api.searchTms(accountUid, searchParams());
        }

        logResponse("searchTms", found);

        assert.ok(found, "searchTms returned null");
        assert.ok(found.some((tm) => tm.tmUid === expectedTmUid), "searchTms did not return the TM created by this suite");
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

        while (!searchResult?.stringCount && Date.now() < searchDeadline) {
            /* eslint-disable-next-line no-await-in-loop */
            await delay(2000);
            /* eslint-disable-next-line no-await-in-loop */
            searchResult = await api.createStringSearch(accountUid, searchFilter);
        }

        logResponse("createStringSearch", searchResult);
        assert.ok(searchResult, "createStringSearch returned null");
        assert.ok(searchResult.searchUid);
        assert.ok(searchResult.stringCount);

        const exportResult = await api.bulkExportTmStrings(
            accountUid,
            new BulkExportTmStringsParameters().setSearchUid(searchResult.searchUid)
        );

        logResponse("bulkExportTmStrings", exportResult);
        assert.ok(exportResult, "bulkExportTmStrings returned null");
        assert.ok(exportResult.actionUid);

        // executionComplete alone isn't a success signal: a CANCELED/STOPPED action is
        // "finished" in the sense that it won't progress further, so poll until the status
        // reaches any terminal state, not just until executionComplete flips true.
        const terminalStatuses = ["SUCCESS", "FAILURE", "CANCELED", "STOPPED"];
        let status = await api.getBulkExportTmStringsStatus(accountUid, exportResult.actionUid);
        const deadline = Date.now() + 90000;

        while (
            !(status?.executionComplete || terminalStatuses.includes(status?.actionStatus))
            && Date.now() < deadline
        ) {
            /* eslint-disable-next-line no-await-in-loop */
            await delay(2000);
            /* eslint-disable-next-line no-await-in-loop */
            status = await api.getBulkExportTmStringsStatus(accountUid, exportResult.actionUid);
        }

        logResponse("getBulkExportTmStringsStatus", status);
        assert.ok(status, "getBulkExportTmStringsStatus returned null");
        assert.equal(status.actionStatus, "SUCCESS");
        assert.equal(status.executionComplete, true);
        assert.ok(status.tmxDownloadKey, "bulkExportTmStrings completed but returned no tmxDownloadKey - can't exercise downloadTmxFile");

        const downloaded = await api.downloadTmxFile(accountUid, status.tmxDownloadKey);

        logResponse("downloadTmxFile", {
            fileName: downloaded.fileName,
            contentType: downloaded.contentType,
            byteLength: downloaded.fileContent.byteLength
        });

        assert.ok(downloaded.fileContent.byteLength > 0);
    });
});
