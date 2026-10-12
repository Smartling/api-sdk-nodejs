import * as fs from "fs";
import sinon from "sinon";
import assert from "assert";
import { authMock, loggerMock, responseMock } from "./mock";
import { SmartlingTranslationMemoryApi } from "../api/translation-memory/index";
import { SmartlingAuthApi } from "../api/auth";
import { ImportTmxFileParameters } from "../api/translation-memory/params/import-tmx-file-parameters";
import { EscapeSmpUnicodeParserDirective } from "../api/translation-memory/params/escape-smp-unicode-parser-directive";
import { CreateStringSearchFilterParameters } from "../api/translation-memory/params/create-string-search-filter-parameters";
import { BulkExportTmStringsParameters } from "../api/translation-memory/params/bulk-export-tm-strings-parameters";
import { ExtendedExportMetadataType } from "../api/translation-memory/params/extended-export-metadata-type";
import { CreateTmParameters } from "../api/translation-memory/params/create-tm-parameters";
import { UpdateTmParameters } from "../api/translation-memory/params/update-tm-parameters";
import { TranslationQualityType } from "../api/translation-memory/params/translation-quality-type";
import { streamToString } from "./stream-to-string";

const noRequestIdHeaders = { get: (): string | null => null };

function tmGraphQlResponseMock(operationName: string, tm: Record<string, unknown>): {
    status: number;
    headers: { get: (name: string) => string | null };
    text: () => Promise<string>;
} {
    return {
        status: 200,
        headers: noRequestIdHeaders,
        text: async (): Promise<string> => JSON.stringify({
            data: {
                [operationName]: tm
            }
        })
    };
}

const sampleTm = {
    tmUid: "j45v1uvsi3tx",
    name: "Integration test TM",
    description: "Created by the SDK test suite",
    sourceLocaleId: "en-US",
    sourceLocale: {
        localeId: "en-US",
        localeDescription: "English (United States)",
        rtlLanguage: false,
        wordSpacing: true
    },
    creator: { userUid: "creatorUid", name: "Creator Name" },
    created: "2026-06-17T00:09:44Z",
    lastModifier: { userUid: "modifierUid", name: "Modifier Name" },
    lastModified: "2026-06-17T00:09:44Z",
    localeSummary: [],
    translationQuality: "TRANSLATION",
    managedWordsEnabled: false
};

describe("SmartlingTranslationMemoryApi class tests.", () => {
    const accountUid = "testAccountUid";
    let translationMemoryApi: SmartlingTranslationMemoryApi;
    let fetchStub;
    let uaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        translationMemoryApi = new SmartlingTranslationMemoryApi(
            "https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock
        );
        fetchStub = sinon.stub(translationMemoryApi, "fetch");
        uaStub = sinon.stub(translationMemoryApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        uaStub.returns("test_user_agent");
        fetchStub.returns(responseMock);
        responseMockJsonStub.returns({ response: {} });
    });

    afterEach(() => {
        fetchStub.restore();
        responseMockJsonStub.restore();
        uaStub.restore();
    });

    describe("Methods", () => {
        it("Import TMX file", async () => {
            const params = new ImportTmxFileParameters()
                .setFileFromLocalFilePath("./test/data/file.xml")
                .setFileUri("test/file.tmx")
                .setTmUid("j45v1uvsi3tx")
                .setDescription("Integration test import")
                .setTranslatorNameLocation("@tu.changeid")
                .setTranslationDateLocation("@tu.creationdate")
                .setVariantLocation("@prop.type.x-SID:SingleString")
                .setFileUriLocation("@prop.type.x-idiom-source-ipath")
                .setEscapeSmpUnicodeParserDirective(EscapeSmpUnicodeParserDirective.ON);

            await translationMemoryApi.importTmxFile(accountUid, params);

            sinon.assert.calledOnce(fetchStub);

            assert.equal(
                fetchStub.getCall(0).args[0],
                `https://test.com/tm-tmx-api/v2/accounts/${accountUid}/tmx/file`
            );
            assert.equal(fetchStub.getCall(0).args[1].method, "post");
            assert.equal(
                fetchStub.getCall(0).args[1].headers.Authorization,
                "test_token_type test_access_token"
            );

            assert.equal(
                // eslint-disable-next-line no-underscore-dangle
                await streamToString(fetchStub.getCall(0).args[1].body._streams[1]),
                fs.readFileSync(fs.realpathSync("./test/data/file.xml"), "utf8")
            );
        });

        it("Import TMX file: as string", async () => {
            const params = new ImportTmxFileParameters()
                .setFileContent(fs.readFileSync(fs.realpathSync("./test/data/file.xml"), "utf8"))
                .setFileUri("test/file.tmx")
                .setTmUid("j45v1uvsi3tx");

            await translationMemoryApi.importTmxFile(accountUid, params);

            sinon.assert.calledOnce(fetchStub);
            assert.equal(
                // eslint-disable-next-line no-underscore-dangle
                await streamToString(fetchStub.getCall(0).args[1].body._streams[1]),
                fs.readFileSync(fs.realpathSync("./test/data/file.xml"), "utf8")
            );
        });

        it("Import TMX file: from buffer", async () => {
            const fileBuffer = fs.readFileSync(fs.realpathSync("./test/data/file.xml"));
            const params = new ImportTmxFileParameters()
                .setFileContentFromBuffer(fileBuffer)
                .setFileUri("test/file.tmx")
                .setTmUid("j45v1uvsi3tx");

            await translationMemoryApi.importTmxFile(accountUid, params);

            sinon.assert.calledOnce(fetchStub);
            assert.ok(
                // eslint-disable-next-line no-underscore-dangle
                fetchStub.getCall(0).args[1].body._streams[1].equals(fileBuffer)
            );
        });

        it("Import TMX file: FormData body is not reconverted on a 401 retry", async () => {
            const params = new ImportTmxFileParameters()
                .setFileFromLocalFilePath("./test/data/file.xml")
                .setFileUri("test/file.tmx")
                .setTmUid("j45v1uvsi3tx");

            fetchStub.onCall(0).returns({ status: 401 });
            fetchStub.onCall(1).returns(responseMock);

            await translationMemoryApi.importTmxFile(accountUid, params);

            sinon.assert.calledTwice(fetchStub);

            // alterRequestData() runs again on the retry with the same opts object - the guard
            // must recognize the body is already a FormData instance and leave it untouched,
            // rather than re-running Object.keys()/forEach() over FormData's own internals.
            assert.strictEqual(
                fetchStub.getCall(0).args[1].body,
                fetchStub.getCall(1).args[1].body
            );

            assert.equal(
                // eslint-disable-next-line no-underscore-dangle
                await streamToString(fetchStub.getCall(1).args[1].body._streams[1]),
                fs.readFileSync(fs.realpathSync("./test/data/file.xml"), "utf8")
            );
        });

        it("Download TMX file", async () => {
            const downloadResponseMock = {
                status: 200,
                headers: {
                    get: (name: string): string | null => {
                        if (name === "content-type") {
                            return "application/xml";
                        }

                        if (name === "content-disposition") {
                            return "attachment; filename=\"export.tmx\"";
                        }

                        return null;
                    }
                },
                arrayBuffer: async (): Promise<ArrayBuffer> => new ArrayBuffer(8)
            };

            fetchStub.returns(downloadResponseMock);

            const result = await translationMemoryApi.downloadTmxFile(accountUid, "testTmxFileKey");

            sinon.assert.calledOnceWithExactly(
                fetchStub,
                `https://test.com/tm-tmx-api/v2/accounts/${accountUid}/tmx/file/testTmxFileKey`,
                {
                    method: "get",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    }
                }
            );

            assert.equal(result.fileName, "export.tmx");
            assert.equal(result.contentType, "application/xml");
        });

        it("Create string search", async () => {
            const graphQlResponseMock = {
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({
                    data: {
                        createStringSearch: {
                            searchUid: "2z68632hdvw2",
                            stringCount: 10,
                            wordCount: 20,
                            duplicateStrings: [],
                            duplicateSearch: false,
                            actionUid: "d23eb702-7358-11ea-bc55-0242ac130003",
                            offlineReportUid: "6a2f41a3-c54c-fce8-32d2-0324e1c32e22"
                        }
                    }
                })
            };

            fetchStub.returns(graphQlResponseMock);

            const filter = new CreateStringSearchFilterParameters()
                .setTmUids(["j45v1uvsi3tx"])
                .setSourceLocaleIds(["en-US"]);

            const result = await translationMemoryApi.createStringSearch(accountUid, filter);

            sinon.assert.calledOnce(fetchStub);
            assert.equal(
                fetchStub.getCall(0).args[0],
                `https://test.com/tm-graphql-api/v2/accounts/${accountUid}/graphql`
            );

            const sentBody = JSON.parse(fetchStub.getCall(0).args[1].body);
            assert.deepEqual(sentBody.variables, {
                createStringSearchFilter: {
                    tmUids: ["j45v1uvsi3tx"],
                    sourceLocaleIds: ["en-US"]
                }
            });

            assert.equal(result.searchUid, "2z68632hdvw2");
            assert.equal(result.stringCount, 10);
        });

        it("Create string search: GraphQL error is thrown", async () => {
            const graphQlResponseMock = {
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({
                    errors: [{ message: "tmUids is required" }]
                })
            };

            fetchStub.returns(graphQlResponseMock);

            await assert.rejects(
                translationMemoryApi.createStringSearch(
                    accountUid, new CreateStringSearchFilterParameters()
                )
            );
        });

        it("Create string search: malformed JSON response throws", async () => {
            fetchStub.returns({
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => "not json"
            });

            await assert.rejects(
                translationMemoryApi.createStringSearch(
                    accountUid, new CreateStringSearchFilterParameters()
                )
            );
        });

        it("Create string search: response missing data throws", async () => {
            fetchStub.returns({
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({})
            });

            await assert.rejects(
                translationMemoryApi.createStringSearch(
                    accountUid, new CreateStringSearchFilterParameters()
                )
            );
        });

        it("Bulk export TM strings", async () => {
            const graphQlResponseMock = {
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({
                    data: {
                        bulkExportTmStrings: {
                            actionUid: "d23eb702-7358-11ea-bc55-0242ac130003",
                            totalCount: 123,
                            processedCount: 0,
                            errorCount: 0,
                            executionComplete: false,
                            actionStatus: "QUEUEING"
                        }
                    }
                })
            };

            fetchStub.returns(graphQlResponseMock);

            const params = new BulkExportTmStringsParameters()
                .setSearchUid("2z68632hdvw2")
                .setExtendedMetadata(true)
                .setExtendedMetadataType(ExtendedExportMetadataType.FIRST_TRANSLATED_STRINGS)
                .setIncludeAllVariants(true);

            const result = await translationMemoryApi.bulkExportTmStrings(accountUid, params);

            const sentBody = JSON.parse(fetchStub.getCall(0).args[1].body);
            assert.deepEqual(sentBody.variables, {
                bulkExportTmStrings: {
                    searchUid: "2z68632hdvw2",
                    extendedMetadata: true,
                    extendedMetadataType: "FIRST_TRANSLATED_STRINGS",
                    includeAllVariants: true
                }
            });

            assert.equal(result.actionUid, "d23eb702-7358-11ea-bc55-0242ac130003");
            assert.equal(result.actionStatus, "QUEUEING");
        });

        it("Get bulk export TM strings status", async () => {
            const graphQlResponseMock = {
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({
                    data: {
                        bulkExportTmStringsStatus: {
                            actionUid: "d23eb702-7358-11ea-bc55-0242ac130003",
                            totalCount: 123,
                            processedCount: 123,
                            errorCount: 0,
                            executionComplete: true,
                            tmxDownloadKey: "ZGpoaDczaGRqc2o6MA==",
                            expired: false,
                            actionStatus: "SUCCESS"
                        }
                    }
                })
            };

            fetchStub.returns(graphQlResponseMock);

            const result = await translationMemoryApi.getBulkExportTmStringsStatus(
                accountUid, "d23eb702-7358-11ea-bc55-0242ac130003"
            );

            const sentBody = JSON.parse(fetchStub.getCall(0).args[1].body);
            assert.deepEqual(sentBody.variables, {
                actionUid: "d23eb702-7358-11ea-bc55-0242ac130003"
            });

            assert.equal(result.tmxDownloadKey, "ZGpoaDczaGRqc2o6MA==");
            assert.equal(result.executionComplete, true);
        });

        it("Create TM", async () => {
            fetchStub.returns(tmGraphQlResponseMock("createTm", sampleTm));

            const params = new CreateTmParameters()
                .setName("Integration test TM")
                .setDescription("Created by the SDK test suite")
                .setSourceLocaleId("en-US")
                .setTranslationQuality(TranslationQualityType.TRANSLATION);

            const result = await translationMemoryApi.createTm(accountUid, params);

            sinon.assert.calledOnce(fetchStub);
            assert.equal(
                fetchStub.getCall(0).args[0],
                `https://test.com/tm-graphql-api/v2/accounts/${accountUid}/graphql`
            );

            const sentBody = JSON.parse(fetchStub.getCall(0).args[1].body);
            assert.deepEqual(sentBody.variables, {
                createTm: {
                    name: "Integration test TM",
                    description: "Created by the SDK test suite",
                    sourceLocaleId: "en-US",
                    translationQuality: "TRANSLATION"
                }
            });

            assert.equal(result.tmUid, "j45v1uvsi3tx");
            assert.ok(result.created instanceof Date);
            assert.ok(result.lastModified instanceof Date);
        });

        it("Update TM", async () => {
            fetchStub.returns(tmGraphQlResponseMock("updateTm", sampleTm));

            const params = new UpdateTmParameters()
                .setTmUid("j45v1uvsi3tx")
                .setName("Renamed TM")
                .setDescription("Updated description");

            const result = await translationMemoryApi.updateTm(accountUid, params);

            const sentBody = JSON.parse(fetchStub.getCall(0).args[1].body);
            assert.deepEqual(sentBody.variables, {
                updateTm: {
                    tmUid: "j45v1uvsi3tx",
                    name: "Renamed TM",
                    description: "Updated description"
                }
            });

            assert.equal(result.tmUid, "j45v1uvsi3tx");
        });

        it("Delete TM", async () => {
            fetchStub.returns(tmGraphQlResponseMock("deleteTm", sampleTm));

            const result = await translationMemoryApi.deleteTm(accountUid, "j45v1uvsi3tx");

            const sentBody = JSON.parse(fetchStub.getCall(0).args[1].body);
            assert.deepEqual(sentBody.variables, {
                deleteTm: { tmUid: "j45v1uvsi3tx" }
            });

            assert.equal(result.tmUid, "j45v1uvsi3tx");
        });
    });
});
