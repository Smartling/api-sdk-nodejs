import dotenv from "dotenv";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../../api/builder/index";
import { SmartlingGlossariesApi } from "../../api/glossaries/index";
import { CreateGlossaryParameters } from "../../api/glossaries/params/create-glossary-parameters";
import { ArchiveGlossariesParameters } from "../../api/glossaries/params/archive-glossaries-parameters";
import { SearchGlossaryCountsParameters } from "../../api/glossaries/params/search-glossary-counts-parameters";
import { SearchGlossariesParameters } from "../../api/glossaries/params/search-glossaries-parameters";
import { CreateGlossaryEntryParameters } from "../../api/glossaries/params/create-glossary-entry-parameters";
import { SearchGlossaryEntriesParameters } from "../../api/glossaries/params/search-glossary-entries-parameters";
import { EntriesBulkActionParameters } from "../../api/glossaries/params/entries-bulk-action-parameters";
import { EntriesBulkLabelsParameters } from "../../api/glossaries/params/entries-bulk-labels-parameters";
import { CreateLabelParameters } from "../../api/glossaries/params/create-label-parameters";
import { InitializeImportParameters } from "../../api/glossaries/params/initialize-import-parameters";
import { ExportEntriesParameters } from "../../api/glossaries/params/export-entries-parameters";
import { ImportFileMediaType } from "../../api/glossaries/enums/import-file-media-type";
import { ExportFormat } from "../../api/glossaries/enums/export-format";

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

describe("SmartlingGlossariesApi integration tests.", function integrationSuite() {
    this.timeout(60000);

    let api: SmartlingGlossariesApi;
    let glossaryUid: string;
    let entryUid: string;
    let labelUid: string;

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping Glossaries integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET in .env");
            this.skip();
        }

        api = new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret)
            .build(SmartlingGlossariesApi);
    });

    before(async () => {
        const created = await api.createGlossary(
            accountUid,
            new CreateGlossaryParameters()
                .setGlossaryName(`Integration test glossary ${Date.now()}`)
                .setLocaleIds(["en-US", "fr-FR"])
        );

        logResponse("createGlossary", created);
        ({ glossaryUid } = created);
    });

    after(async () => {
        if (glossaryUid) {
            const archived = await api.archiveGlossaries(
                accountUid,
                new ArchiveGlossariesParameters().setGlossaryUids([glossaryUid])
            );

            logResponse("archiveGlossaries (cleanup)", archived);
        }
    });

    it("gets the created glossary", async () => {
        const glossary = await api.getGlossary(accountUid, glossaryUid);

        logResponse("getGlossary", glossary);
        assert.equal(glossary.glossaryUid, glossaryUid);
    });

    it("updates the glossary", async () => {
        const updated = await api.updateGlossary(
            accountUid,
            glossaryUid,
            new CreateGlossaryParameters()
                .setGlossaryName(`Integration test glossary ${Date.now()} (updated)`)
                .setLocaleIds(["en-US", "fr-FR"])
        );

        logResponse("updateGlossary", updated);
        assert.equal(updated.glossaryUid, glossaryUid);
    });

    it("archives and restores the glossary", async () => {
        const archived = await api.archiveGlossaries(
            accountUid,
            new ArchiveGlossariesParameters().setGlossaryUids([glossaryUid])
        );

        logResponse("archiveGlossaries", archived);
        assert.ok(archived.glossaryUids.includes(glossaryUid));

        const restored = await api.restoreGlossaries(
            accountUid,
            new ArchiveGlossariesParameters().setGlossaryUids([glossaryUid])
        );

        logResponse("restoreGlossaries", restored);
        assert.ok(restored.glossaryUids.includes(glossaryUid));
    });

    it("searches glossaries", async () => {
        const result = await api.searchGlossaries(
            accountUid,
            new SearchGlossariesParameters().setGlossaryUids([glossaryUid])
        );

        logResponse("searchGlossaries", result);
        assert.equal(result.items.length, 1);
    });

    it("searches glossaries with entries counts", async () => {
        const result = await api.searchGlossariesWithEntriesCounts(
            accountUid,
            new SearchGlossaryCountsParameters().setGlossaryUids([glossaryUid])
        );

        logResponse("searchGlossariesWithEntriesCounts", result);
        assert.equal(result.items.length, 1);
    });

    it("creates a glossary entry", async () => {
        const entry = await api.createGlossaryEntry(
            accountUid,
            glossaryUid,
            new CreateGlossaryEntryParameters()
                .setDefinition("Integration test term")
                .setTranslations([{ localeId: "fr-FR", term: "Terme de test" }])
        );

        logResponse("createGlossaryEntry", entry);
        ({ entryUid } = entry);
        assert.ok(entryUid);
    });

    it("reads the created glossary entry", async () => {
        const entry = await api.readGlossaryEntry(accountUid, glossaryUid, entryUid);

        logResponse("readGlossaryEntry", entry);
        assert.equal(entry.entryUid, entryUid);
    });

    it("updates the glossary entry", async () => {
        const entry = await api.updateGlossaryEntry(
            accountUid,
            glossaryUid,
            entryUid,
            new CreateGlossaryEntryParameters()
                .setDefinition("Integration test term (updated)")
                .setTranslations([{ localeId: "fr-FR", term: "Terme de test (modifie)" }])
        );

        logResponse("updateGlossaryEntry", entry);
        assert.equal(entry.entryUid, entryUid);
    });

    it("searches glossary entries", async () => {
        const result = await api.searchGlossaryEntries(
            accountUid,
            glossaryUid,
            new SearchGlossaryEntriesParameters().setEntryUids([entryUid])
        );

        logResponse("searchGlossaryEntries", result);
        assert.equal(result.items.length, 1);
    });

    it("creates and reads back a label", async () => {
        const label = await api.createGlossaryLabel(
            accountUid,
            new CreateLabelParameters().setLabelText(`Integration label ${Date.now()}`)
        );

        logResponse("createGlossaryLabel", label);
        ({ labelUid } = label);

        const updatedLabel = await api.updateGlossaryLabel(
            accountUid,
            labelUid,
            new CreateLabelParameters().setLabelText(`Integration label ${Date.now()} (updated)`)
        );

        logResponse("updateGlossaryLabel", updatedLabel);

        const allLabels = await api.readAllGlossaryLabels(accountUid);

        logResponse("readAllGlossaryLabels", allLabels);
        assert.ok(allLabels.items.some((label2) => label2.labelUid === labelUid));
    });

    it("adds and removes a label on the glossary entry", async () => {
        const addResult = await api.addLabelsToGlossaryEntries(
            accountUid,
            glossaryUid,
            new EntriesBulkLabelsParameters()
                .setFilterEntryUids([entryUid])
                .setLabelUids([labelUid])
        );

        logResponse("addLabelsToGlossaryEntries", addResult);
        assert.ok(addResult.operationUid);

        const removeResult = await api.removeLabelsFromGlossaryEntries(
            accountUid,
            glossaryUid,
            new EntriesBulkLabelsParameters()
                .setFilterEntryUids([entryUid])
                .setLabelUids([labelUid])
        );

        logResponse("removeLabelsFromGlossaryEntries", removeResult);
        assert.ok(removeResult.operationUid);
    });

    it("deletes the label", async () => {
        await api.deleteGlossaryLabel(accountUid, labelUid);
    });

    it("archives and restores the glossary entry", async () => {
        const archiveResult = await api.archiveGlossaryEntries(
            accountUid,
            glossaryUid,
            new EntriesBulkActionParameters().setFilterEntryUids([entryUid])
        );

        logResponse("archiveGlossaryEntries", archiveResult);
        assert.ok(archiveResult.operationUid);

        const restoreResult = await api.restoreGlossaryEntries(
            accountUid,
            glossaryUid,
            new EntriesBulkActionParameters().setFilterEntryUids([entryUid])
        );

        logResponse("restoreGlossaryEntries", restoreResult);
        assert.ok(restoreResult.operationUid);
    });

    it("exports glossary entries", async () => {
        const exported = await api.exportGlossaryEntries(
            accountUid,
            glossaryUid,
            new ExportEntriesParameters().setFormat(ExportFormat.CSV).setLocaleIds(["fr-FR"])
        );

        logResponse("exportGlossaryEntries (length)", exported.length);
        assert.ok(exported.length > 0);
    });

    it("initializes, checks, and confirms a glossary import", async () => {
        const importResult = await api.initializeGlossaryImport(
            accountUid,
            glossaryUid,
            new InitializeImportParameters()
                .setImportFileContent("definition,fr-FR\nImported term,Terme importe\n")
                .setImportFileName("integration-import.csv")
                .setImportFileMediaType(ImportFileMediaType.CSV)
        );

        logResponse("initializeGlossaryImport", importResult);
        assert.ok(importResult.importUid);

        const status = await api.importStatus(accountUid, glossaryUid, importResult.importUid);

        logResponse("importStatus", status);
        assert.equal(status.importUid, importResult.importUid);

        const confirmed = await api.confirmGlossaryImport(
            accountUid,
            glossaryUid,
            importResult.importUid
        );

        logResponse("confirmGlossaryImport", confirmed);
        assert.equal(confirmed.importUid, importResult.importUid);
    });

    it("removes the glossary entry", async () => {
        const result = await api.removeGlossaryEntries(
            accountUid,
            glossaryUid,
            new EntriesBulkActionParameters().setFilterEntryUids([entryUid])
        );

        logResponse("removeGlossaryEntries", result);
        assert.ok(result.operationUid);
    });
});
