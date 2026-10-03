import sinon from "sinon";
import { SmartlingGlossariesApi } from "../api/glossaries/index";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingAuthApi } from "../api/auth/index";
import { SearchGlossariesParameters } from "../api/glossaries/params/search-glossaries-parameters";
import { ExportEntriesParameters } from "../api/glossaries/params/export-entries-parameters";
import { ExportFormat, TbxVersion, EntryState, FilterLevel, SortField, SortDirection, LabelType, DateFilterType } from "../api/glossaries/enums";
import { CreateGlossaryParameters } from "../api/glossaries/params/create-glossary-parameters";
import { ArchiveGlossariesParameters } from "../api/glossaries/params/archive-glossaries-parameters";
import { SearchGlossaryCountsParameters } from "../api/glossaries/params/search-glossary-counts-parameters";
import { CreateGlossaryEntryParameters } from "../api/glossaries/params/create-glossary-entry-parameters";
import { SearchGlossaryEntriesParameters } from "../api/glossaries/params/search-glossary-entries-parameters";
import { PartOfSpeech } from "../api/glossaries/enums/part-of-speech";
import { EntriesBulkActionParameters } from "../api/glossaries/params/entries-bulk-action-parameters";
import { EntriesBulkLabelsParameters } from "../api/glossaries/params/entries-bulk-labels-parameters";

describe("SmartlingGlossariesApi class tests.", () => {
    const accountUid = "testAccountUid";
    const glossaryUid = "testGlossaryUid";
    let glossariesApi: SmartlingGlossariesApi;
    let glossariesApiFetchStub;
    let glossariesApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        glossariesApi = new SmartlingGlossariesApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);
        glossariesApiFetchStub = sinon.stub(glossariesApi, "fetch");
        glossariesApiUaStub = sinon.stub(glossariesApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        glossariesApiUaStub.returns("test_user_agent");
        glossariesApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        glossariesApiFetchStub.restore();
        responseMockJsonStub.restore();
        glossariesApiUaStub.restore();
    });

    describe("Methods", () => {
        it("Search glossaries with parameters", async () => {
            const parameters = new SearchGlossariesParameters()
                .setQuery("test glossary")
                .setGlossaryState("ACTIVE")
                .setTargetLocaleId("en-US")
                .setGlossaryUids(["uid1", "uid2"])
                .setPaging({ offset: 0, limit: 10 })
                .setSorting({ field: "glossaryName", direction: "ASC" })
                .setIncludeEntriesCount(true);

            await glossariesApi.searchGlossaries(accountUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/search`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        query: "test glossary",
                        glossaryState: "ACTIVE",
                        targetLocaleId: "en-US",
                        glossaryUids: ["uid1", "uid2"],
                        paging: { offset: 0, limit: 10 },
                        sorting: { field: "glossaryName", direction: "ASC" },
                        includeEntriesCount: true
                    })
                }
            );
        });

        it("Get glossary", async () => {
            await glossariesApi.getGlossary(accountUid, glossaryUid);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/${glossaryUid}`,
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

        it("Export glossary entries with minimal parameters", async () => {
            const parameters = new ExportEntriesParameters()
                .setFormat(ExportFormat.CSV)
                .setLocaleIds(["en-US", "fr-FR"]);

            await glossariesApi.exportGlossaryEntries(accountUid, glossaryUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/${glossaryUid}/entries/download`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        filter: {},
                        localeIds: ["en-US", "fr-FR"],
                        format: "CSV"
                    })
                }
            );
        });

        it("Export glossary entries with full parameters", async () => {
            const parameters = new ExportEntriesParameters()
                .setFormat(ExportFormat.TBX)
                .setTbxVersion(TbxVersion.TBXcoreStructV02)
                .setLocaleIds(["en-US", "uk-UA"])
                .setFocusLocaleId("en-US")
                .setSkipEntries(false)
                .setFilterQuery("P&G term")
                .setFilterLocaleIds(["uk-UA", "en", "en-US"])
                .setFilterEntryUids(["16ed66cc-accc-4bb5-9822-bc84e93429f8", "69dae398-96c2-45f6-9f0d-91470c3464bd"])
                .setFilterEntryState(EntryState.ACTIVE)
                .setFilterMissingTranslationLocaleId("uk-UA")
                .setFilterPresentTranslationLocaleId("uk-UA")
                .setFilterDntLocaleId("uk-UA")
                .setFilterReturnFallbackTranslations(false)
                .setFilterLabels({ type: LabelType.EMPTY })
                .setFilterDntTermSet(false)
                .setFilterCreated({ level: FilterLevel.ANY, type: DateFilterType.AFTER, date: "2023-02-01T11:45:00.000Z" })
                .setFilterLastModified({ level: FilterLevel.ANY, type: DateFilterType.AFTER, date: "2023-02-01T11:45:00.000Z" })
                .setFilterCreatedBy({ level: FilterLevel.ANY, userIds: ["user1", "user2"] })
                .setFilterLastModifiedBy({ level: FilterLevel.ANY, userIds: ["user1", "user2"] })
                .setFilterPaging({ offset: 0, limit: 50 })
                .setFilterSorting({ field: SortField.TERM, direction: SortDirection.DESC, localeId: "uk-UA" });

            await glossariesApi.exportGlossaryEntries(accountUid, glossaryUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            const callArgs = glossariesApiFetchStub.getCall(0).args;
            const body = JSON.parse(callArgs[1].body);

            sinon.assert.match(body, {
                format: "TBX",
                tbxVersion: "TBXcoreStructV02",
                localeIds: ["en-US", "uk-UA"],
                focusLocaleId: "en-US",
                skipEntries: false,
                filter: {
                    query: "P&G term",
                    localeIds: ["uk-UA", "en", "en-US"],
                    entryUids: ["16ed66cc-accc-4bb5-9822-bc84e93429f8", "69dae398-96c2-45f6-9f0d-91470c3464bd"],
                    entryState: "ACTIVE",
                    missingTranslationLocaleId: "uk-UA",
                    presentTranslationLocaleId: "uk-UA",
                    dntLocaleId: "uk-UA",
                    returnFallbackTranslations: false,
                    labels: { type: "empty" },
                    dntTermSet: false,
                    created: {
                        level: "ANY",
                        date: "2023-02-01T11:45:00.000Z",
                        type: "after"
                    },
                    lastModified: {
                        level: "ANY",
                        date: "2023-02-01T11:45:00.000Z",
                        type: "after"
                    },
                    createdBy: {
                        level: "ANY",
                        userIds: ["user1", "user2"]
                    },
                    lastModifiedBy: {
                        level: "ANY",
                        userIds: ["user1", "user2"]
                    },
                    paging: {
                        offset: 0,
                        limit: 50
                    },
                    sorting: {
                        field: "term",
                        direction: "DESC",
                        localeId: "uk-UA"
                    }
                }
            });
        });

        it("Create glossary", async () => {
            const parameters = new CreateGlossaryParameters()
                .setGlossaryName("Test glossary")
                .setDescription("Test description")
                .setVerificationMode(true)
                .setLocaleIds(["en-US", "fr-FR"])
                .setFallbackLocales([{ fallbackLocaleId: "fr-FR", localeIds: ["fr-CA"] }])
                .setMtOptimized(true);

            await glossariesApi.createGlossary(accountUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        glossaryName: "Test glossary",
                        description: "Test description",
                        verificationMode: true,
                        localeIds: ["en-US", "fr-FR"],
                        fallbackLocales: [{ fallbackLocaleId: "fr-FR", localeIds: ["fr-CA"] }],
                        mtOptimized: true
                    })
                }
            );
        });

        it("Update glossary", async () => {
            const parameters = new CreateGlossaryParameters()
                .setGlossaryName("Updated glossary")
                .setLocaleIds(["en-US"]);

            await glossariesApi.updateGlossary(accountUid, glossaryUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/${glossaryUid}`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put",
                    body: JSON.stringify({
                        glossaryName: "Updated glossary",
                        localeIds: ["en-US"]
                    })
                }
            );
        });

        it("Archive glossaries", async () => {
            const parameters = new ArchiveGlossariesParameters().setGlossaryUids(["uid1", "uid2"]);

            await glossariesApi.archiveGlossaries(accountUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/archive`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({ glossaryUids: ["uid1", "uid2"] })
                }
            );
        });

        it("Restore glossaries", async () => {
            const parameters = new ArchiveGlossariesParameters().setGlossaryUids(["uid1"]);

            await glossariesApi.restoreGlossaries(accountUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/unarchive`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({ glossaryUids: ["uid1"] })
                }
            );
        });

        it("Search glossaries with entries counts", async () => {
            const parameters = new SearchGlossaryCountsParameters()
                .setQuery("test")
                .setGlossaryState("ACTIVE")
                .setPaging({ offset: 0, limit: 10 });

            await glossariesApi.searchGlossariesWithEntriesCounts(accountUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/search/count`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        query: "test",
                        glossaryState: "ACTIVE",
                        paging: { offset: 0, limit: 10 }
                    })
                }
            );
        });

        it("Create glossary entry", async () => {
            const parameters = new CreateGlossaryEntryParameters()
                .setDefinition("A test term")
                .setPartOfSpeech(PartOfSpeech.NOUN)
                .setLabelUids(["label1"])
                .setSkipMissingTranslations(false)
                .setSuggestion(true);

            await glossariesApi.createGlossaryEntry(accountUid, glossaryUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/${glossaryUid}/entries`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        definition: "A test term",
                        partOfSpeech: "NOUN",
                        labelUids: ["label1"],
                        skipMissingTranslations: false,
                        suggestion: true
                    })
                }
            );
        });

        it("Read glossary entry", async () => {
            await glossariesApi.readGlossaryEntry(accountUid, glossaryUid, "testEntryUid");

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/${glossaryUid}/entries/testEntryUid`,
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

        it("Update glossary entry", async () => {
            const parameters = new CreateGlossaryEntryParameters().setDefinition("Updated term");

            await glossariesApi.updateGlossaryEntry(accountUid, glossaryUid, "testEntryUid", parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/${glossaryUid}/entries/testEntryUid`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put",
                    body: JSON.stringify({ definition: "Updated term" })
                }
            );
        });

        it("Search glossary entries", async () => {
            const parameters = new SearchGlossaryEntriesParameters()
                .setQuery("test")
                .setEntryState(EntryState.ACTIVE)
                .setPaging({ offset: 0, limit: 10 });

            await glossariesApi.searchGlossaryEntries(accountUid, glossaryUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/${glossaryUid}/entries/search`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        query: "test",
                        entryState: "ACTIVE",
                        paging: { offset: 0, limit: 10 }
                    })
                }
            );
        });

        it("Archive glossary entries", async () => {
            const parameters = new EntriesBulkActionParameters().setFilterEntryUids(["entry1", "entry2"]);

            await glossariesApi.archiveGlossaryEntries(accountUid, glossaryUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/${glossaryUid}/entries/archive`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({ filter: { entryUids: ["entry1", "entry2"] } })
                }
            );
        });

        it("Restore glossary entries", async () => {
            const parameters = new EntriesBulkActionParameters().setFilterEntryUids(["entry1"]);

            await glossariesApi.restoreGlossaryEntries(accountUid, glossaryUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/${glossaryUid}/entries/unarchive`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({ filter: { entryUids: ["entry1"] } })
                }
            );
        });

        it("Remove glossary entries", async () => {
            const parameters = new EntriesBulkActionParameters().setFilterEntryUids(["entry1"]);

            await glossariesApi.removeGlossaryEntries(accountUid, glossaryUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/${glossaryUid}/entries/delete`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({ filter: { entryUids: ["entry1"] } })
                }
            );
        });

        it("Add labels to glossary entries", async () => {
            const parameters = new EntriesBulkLabelsParameters()
                .setFilterEntryUids(["entry1"])
                .setLabelUids(["label1", "label2"]);

            await glossariesApi.addLabelsToGlossaryEntries(accountUid, glossaryUid, parameters);

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/${glossaryUid}/entries/add-labels`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        filter: { entryUids: ["entry1"] },
                        labelUids: ["label1", "label2"]
                    })
                }
            );
        });

        it("Remove labels from glossary entries", async () => {
            const parameters = new EntriesBulkLabelsParameters()
                .setFilterEntryUids(["entry1"])
                .setLabelUids(["label1"]);

            await glossariesApi.removeLabelsFromGlossaryEntries(
                accountUid,
                glossaryUid,
                parameters
            );

            sinon.assert.calledOnce(glossariesApiFetchStub);
            sinon.assert.calledWithExactly(
                glossariesApiFetchStub,
                `https://test.com/glossary-api/v3/accounts/${accountUid}/glossaries/${glossaryUid}/entries/remove-labels`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        filter: { entryUids: ["entry1"] },
                        labelUids: ["label1"]
                    })
                }
            );
        });
    });
});
