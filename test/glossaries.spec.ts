import sinon from "sinon";
import { SmartlingGlossariesApi } from "../api/glossaries/index";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingAuthApi } from "../api/auth/index";
import { SearchGlossariesParameters } from "../api/glossaries/params/search-glossaries-parameters";
import { ExportEntriesParameters } from "../api/glossaries/params/export-entries-parameters";
import { ExportFormat, TbxVersion, EntryState, FilterLevel, SortField, SortDirection, LabelType, DateFilterType } from "../api/glossaries/enums";

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
    });
});
