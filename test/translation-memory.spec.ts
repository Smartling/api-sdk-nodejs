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
import { SearchTmsParameters } from "../api/translation-memory/params/search-tms-parameters";
import { TmSorting } from "../api/translation-memory/params/tm-sorting";
import { TranslationQualityType } from "../api/translation-memory/params/translation-quality-type";
import { LeverageType } from "../api/translation-memory/params/leverage-type";
import { SourceType } from "../api/translation-memory/params/source-type";
import { TuTranslationQualityType } from "../api/translation-memory/params/tu-translation-quality-type";
import { KeywordSearchType } from "../api/translation-memory/params/keyword-search-type";
import { SmartlingException } from "../api/exception/index";
import { streamToString } from "./stream-to-string";

function formDataText(formData: { _streams: Array<unknown> }): string {
    // eslint-disable-next-line no-underscore-dangle
    return formData._streams.filter((entry) => typeof entry === "string").join("");
}

const noRequestIdHeaders = { get: (): string | null => null };

function tmGraphQlResponseMock(
    operationName: string, tm: Record<string, unknown> | Array<Record<string, unknown>>
): {
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

            const fields = formDataText(fetchStub.getCall(0).args[1].body);

            assert.ok(fields.includes("name=\"file\""));
            assert.ok(fields.includes("name=\"fileUri\"") && fields.includes("test/file.tmx"));
            assert.ok(fields.includes("name=\"tmUid\"") && fields.includes("j45v1uvsi3tx"));
            assert.ok(fields.includes("name=\"description\"") && fields.includes("Integration test import"));
            assert.ok(fields.includes("name=\"translatorNameLocation\"") && fields.includes("@tu.changeid"));
            assert.ok(fields.includes("name=\"translationDateLocation\"") && fields.includes("@tu.creationdate"));
            assert.ok(fields.includes("name=\"variantLocation\"") && fields.includes("@prop.type.x-SID:SingleString"));
            assert.ok(fields.includes("name=\"fileUriLocation\"") && fields.includes("@prop.type.x-idiom-source-ipath"));
            assert.ok(fields.includes("name=\"escapeSmpUnicodeParserDirective\"") && fields.includes("on"));
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

        it("Import TMX file: warns when the response has partial import errors", async () => {
            const warnStub = sinon.stub(loggerMock, "warn");

            fetchStub.returns({
                status: 200,
                text: async (): Promise<string> => JSON.stringify({
                    response: {
                        data: {
                            message: null,
                            wordCount: 10,
                            stringCount: 5,
                            translationMemoryImportErrors: [
                                { messages: ["bad string"], line: 3, column: 1 }
                            ],
                            parsingErrors: null,
                            jobUid: "job-1",
                            tmxUid: "tmx-1"
                        }
                    }
                })
            });

            const params = new ImportTmxFileParameters()
                .setFileContentFromBuffer(Buffer.from("<tmx/>"))
                .setFileUri("test/file.tmx")
                .setTmUid("j45v1uvsi3tx");

            const result = await translationMemoryApi.importTmxFile(accountUid, params);

            assert.equal(result.jobUid, "job-1");
            assert.equal(result.tmxUid, "tmx-1");
            assert.equal(result.wordCount, 10);
            assert.equal(result.stringCount, 5);
            sinon.assert.calledOnce(warnStub);
            assert.ok(warnStub.getCall(0).args[0].includes("bad string"));

            warnStub.restore();
        });

        it("Import TMX file: does not warn when error arrays are merely empty", async () => {
            const warnStub = sinon.stub(loggerMock, "warn");

            fetchStub.returns({
                status: 200,
                text: async (): Promise<string> => JSON.stringify({
                    response: {
                        data: {
                            message: null,
                            wordCount: 10,
                            stringCount: 5,
                            translationMemoryImportErrors: [],
                            parsingErrors: [],
                            jobUid: "job-1",
                            tmxUid: "tmx-1"
                        }
                    }
                })
            });

            const params = new ImportTmxFileParameters()
                .setFileContentFromBuffer(Buffer.from("<tmx/>"))
                .setFileUri("test/file.tmx")
                .setTmUid("j45v1uvsi3tx");

            await translationMemoryApi.importTmxFile(accountUid, params);

            sinon.assert.notCalled(warnStub);

            warnStub.restore();
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

            // A real tmxDownloadKey is base64 and can contain "+"/"/"/"=" - all of which must be
            // percent-encoded or they'd be misread as URL path/query syntax.
            const result = await translationMemoryApi.downloadTmxFile(accountUid, "a+b/c==");

            sinon.assert.calledOnceWithExactly(
                fetchStub,
                `https://test.com/tm-tmx-api/v2/accounts/${accountUid}/tmx/file/a%2Bb%2Fc%3D%3D`,
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
            assert.ok(sentBody.query.includes("createStringSearch"));
            [
                "searchUid", "stringCount", "wordCount", "duplicateStrings", "duplicateKey",
                "count", "srcText", "srcLocale", "translationLocale", "duplicateSearch",
                "actionUid", "offlineReportUid"
            ].forEach((field) => {
                assert.ok(sentBody.query.includes(field), `query is missing field "${field}"`);
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
                ),
                (e: SmartlingException) => {
                    assert.ok(e instanceof SmartlingException);
                    assert.ok(e.message.includes("tmUids is required"));
                    assert.deepEqual(
                        e.getPayload().errors,
                        [{ message: "tmUids is required" }]
                    );

                    return true;
                }
            );
        });

        it("Create string search: an empty errors array does not throw", async () => {
            fetchStub.returns({
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({
                    errors: [],
                    data: { createStringSearch: { searchUid: "2z68632hdvw2" } }
                })
            });

            const result = await translationMemoryApi.createStringSearch(
                accountUid, new CreateStringSearchFilterParameters()
            );

            assert.equal(result.searchUid, "2z68632hdvw2");
        });

        it("Create string search: a null result is returned as null, not thrown", async () => {
            fetchStub.returns({
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({
                    data: { createStringSearch: null }
                })
            });

            const result = await translationMemoryApi.createStringSearch(
                accountUid, new CreateStringSearchFilterParameters()
            );

            assert.equal(result, null);
        });

        it("Create string search: requestId is propagated into the thrown exception", async () => {
            fetchStub.returns({
                status: 200,
                headers: { get: (name: string): string | null => (name === "x-sl-requestid" ? "test-request-id" : null) },
                text: async (): Promise<string> => JSON.stringify({
                    errors: [{ message: "tmUids is required" }]
                })
            });

            await assert.rejects(
                translationMemoryApi.createStringSearch(
                    accountUid, new CreateStringSearchFilterParameters()
                ),
                (e: SmartlingException) => {
                    assert.equal(e.getPayload().requestId, "test-request-id");

                    return true;
                }
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
                ),
                (e: SmartlingException) => {
                    assert.ok(e instanceof SmartlingException);
                    assert.ok(e.message.includes("Couldn't parse GraphQL response json"));
                    assert.ok(e.getNestedException() instanceof Error);

                    return true;
                }
            );
        });

        it("Create string search: response missing data entirely throws", async () => {
            fetchStub.returns({
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({})
            });

            await assert.rejects(
                translationMemoryApi.createStringSearch(
                    accountUid, new CreateStringSearchFilterParameters()
                ),
                (e: SmartlingException) => {
                    assert.ok(e instanceof SmartlingException);
                    assert.ok(e.message.includes("is missing the expected field"));

                    return true;
                }
            );
        });

        it("Create string search: data present but missing the operation's own key throws", async () => {
            // Distinct from a present-but-null value (handled by the "null result" test above) -
            // this is the key itself being entirely absent, e.g. schema drift or a typo'd
            // operationName, which should fail loudly rather than being coerced to null.
            fetchStub.returns({
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({
                    data: { someOtherOperation: { searchUid: "abc" } }
                })
            });

            await assert.rejects(
                translationMemoryApi.createStringSearch(
                    accountUid, new CreateStringSearchFilterParameters()
                ),
                (e: SmartlingException) => {
                    assert.ok(e instanceof SmartlingException);
                    assert.ok(e.message.includes("is missing the expected field"));

                    return true;
                }
            );
        });

        it("Create string search: a non-array errors field logs a warning and does not throw", async () => {
            const warnStub = sinon.stub(loggerMock, "warn");

            fetchStub.returns({
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({
                    errors: { message: "unexpected shape" },
                    data: { createStringSearch: { searchUid: "2z68632hdvw2" } }
                })
            });

            const result = await translationMemoryApi.createStringSearch(
                accountUid, new CreateStringSearchFilterParameters()
            );

            assert.ok(result);
            assert.equal(result.searchUid, "2z68632hdvw2");
            sinon.assert.calledOnce(warnStub);
            assert.ok(warnStub.getCall(0).args[0].includes("unexpected"));

            warnStub.restore();
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
            assert.ok(sentBody.query.includes("bulkExportTmStrings"));
            assert.ok(sentBody.query.includes("executionComplete"));
            assert.ok(sentBody.query.includes("actionStatus"));

            assert.ok(result);
            assert.equal(result.actionUid, "d23eb702-7358-11ea-bc55-0242ac130003");
            assert.equal(result.actionStatus, "QUEUEING");
        });

        it("Get bulk export TM strings status", async () => {
            const debugStub = sinon.stub(loggerMock, "debug");

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
            assert.ok(sentBody.query.includes("bulkExportTmStringsStatus"));
            assert.ok(sentBody.query.includes("tmxDownloadKey"));
            assert.ok(sentBody.query.includes("expired"));

            assert.ok(result);
            assert.equal(result.tmxDownloadKey, "ZGpoaDczaGRqc2o6MA==");
            assert.equal(result.executionComplete, true);

            // tmxDownloadKey is a bearer-style download token - it must never reach the debug log
            // verbatim, only redacted.
            sinon.assert.calledOnce(debugStub);
            const loggedText = debugStub.getCall(0).args[0];

            assert.ok(loggedText.includes("[REDACTED]"));
            assert.ok(!loggedText.includes("ZGpoaDczaGRqc2o6MA=="));

            debugStub.restore();
        });

        it("Get bulk export TM strings status: tmxDownloadKey is redacted in a thrown exception's payload too", async () => {
            // A field-level error can accompany otherwise-populated partial data (see the
            // "GraphQL error is thrown" test) - the live download token must not leak through
            // that path either, not just the debug log.
            fetchStub.returns({
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({
                    errors: [{ message: "partial failure" }],
                    data: {
                        bulkExportTmStringsStatus: {
                            actionUid: "d23eb702-7358-11ea-bc55-0242ac130003",
                            tmxDownloadKey: "ZGpoaDczaGRqc2o6MA=="
                        }
                    }
                })
            });

            await assert.rejects(
                translationMemoryApi.getBulkExportTmStringsStatus(
                    accountUid, "d23eb702-7358-11ea-bc55-0242ac130003"
                ),
                (e: SmartlingException) => {
                    const payloadText = JSON.stringify(e.getPayload());

                    assert.ok(payloadText.includes("[REDACTED]"));
                    assert.ok(!payloadText.includes("ZGpoaDczaGRqc2o6MA=="));

                    return true;
                }
            );
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
            // Every field this domain's TmDto declares must actually be requested by TM_FIELDS -
            // a typo in either one would silently desync the query from the DTO it populates.
            assert.ok(sentBody.query.includes("createTm"));
            [
                "tmUid", "name", "description", "sourceLocaleId", "sourceLocale", "localeId",
                "localeDescription", "rtlLanguage", "wordSpacing", "creator", "userUid", "created",
                "lastModifier", "lastModified", "localeSummary", "translationLocaleId",
                "translationLocale", "stringCount", "wordCount", "translationQuality",
                "managedWordsEnabled"
            ].forEach((field) => {
                assert.ok(sentBody.query.includes(field), `query is missing field "${field}"`);
            });

            assert.ok(result);
            assert.equal(result.tmUid, "j45v1uvsi3tx");
            assert.ok(result.created instanceof Date);
            assert.ok(result.lastModified instanceof Date);
        });

        it("Create TM: a null result is returned as null, not thrown", async () => {
            fetchStub.returns({
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({ data: { createTm: null } })
            });

            const result = await translationMemoryApi.createTm(
                accountUid, new CreateTmParameters()
            );

            assert.equal(result, null);
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

            assert.ok(result);
            assert.equal(result.tmUid, "j45v1uvsi3tx");
        });

        it("Delete TM", async () => {
            fetchStub.returns(tmGraphQlResponseMock("deleteTm", sampleTm));

            const result = await translationMemoryApi.deleteTm(accountUid, "j45v1uvsi3tx");

            const sentBody = JSON.parse(fetchStub.getCall(0).args[1].body);
            assert.deepEqual(sentBody.variables, {
                deleteTm: { tmUid: "j45v1uvsi3tx" }
            });

            assert.ok(result);
            assert.equal(result.tmUid, "j45v1uvsi3tx");
        });

        it("Get TM", async () => {
            fetchStub.returns(tmGraphQlResponseMock("tm", sampleTm));

            const result = await translationMemoryApi.getTm(accountUid, "j45v1uvsi3tx");

            const sentBody = JSON.parse(fetchStub.getCall(0).args[1].body);
            assert.deepEqual(sentBody.variables, { tmUid: "j45v1uvsi3tx" });
            assert.ok(sentBody.query.includes("tm(tmUid: $tmUid)"));

            assert.ok(result);
            assert.equal(result.tmUid, "j45v1uvsi3tx");
            assert.ok(result.created instanceof Date);
            assert.ok(result.lastModified instanceof Date);
        });

        it("Get TM: a null result is returned as null, not thrown", async () => {
            fetchStub.returns({
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({ data: { tm: null } })
            });

            const result = await translationMemoryApi.getTm(accountUid, "missingTmUid");

            assert.equal(result, null);
        });

        it("Search TMs: exercises every SearchTmsParameters setter", async () => {
            fetchStub.returns(tmGraphQlResponseMock("searchTms", [sampleTm]));

            const params = new SearchTmsParameters()
                .setFirst(25)
                .setOffset(10)
                .setSortBy(TmSorting.BY_NAME_DESC)
                .setSourceLocaleId("en-US")
                .setNameFilter("Marketing")
                .setSourceLanguageId("en")
                .setTranslationQuality(TranslationQualityType.TRANSLATION);

            const result = await translationMemoryApi.searchTms(accountUid, params);

            const sentBody = JSON.parse(fetchStub.getCall(0).args[1].body);
            assert.deepEqual(sentBody.variables, {
                searchTmFilter: {
                    first: 25,
                    offset: 10,
                    sortBy: "BY_NAME_DESC",
                    sourceLocaleId: "en-US",
                    nameFilter: "Marketing",
                    sourceLanguageId: "en",
                    translationQuality: "TRANSLATION"
                }
            });
            assert.ok(sentBody.query.includes("searchTms(searchTmFilter: $searchTmFilter)"));

            assert.ok(result);
            assert.equal(result.length, 1);
            assert.equal(result?.[0]?.tmUid, "j45v1uvsi3tx");
        });

        it("Search TMs: a null result is returned as null, not thrown", async () => {
            fetchStub.returns({
                status: 200,
                headers: noRequestIdHeaders,
                text: async (): Promise<string> => JSON.stringify({ data: { searchTms: null } })
            });

            const result = await translationMemoryApi.searchTms(
                accountUid, new SearchTmsParameters()
            );

            assert.equal(result, null);
        });

        it("Create string search: exercises every CreateStringSearchFilterParameters setter", () => {
            const translationDateRangeStart = new Date("2026-01-01T00:00:00Z");
            const translationDateRangeEnd = new Date("2026-02-01T00:00:00Z");
            const editDateRangeStart = new Date("2026-01-02T00:00:00Z");
            const editDateRangeEnd = new Date("2026-02-02T00:00:00Z");
            const reviewDateRangeStart = new Date("2026-01-03T00:00:00Z");
            const reviewDateRangeEnd = new Date("2026-02-03T00:00:00Z");
            const authorizationDateRangeStart = new Date("2026-01-04T00:00:00Z");
            const authorizationDateRangeEnd = new Date("2026-02-04T00:00:00Z");
            const ingestedDateRangeStart = new Date("2026-01-05T00:00:00Z");
            const ingestedDateRangeEnd = new Date("2026-02-05T00:00:00Z");
            const lastTranslatedAfter = new Date("2026-01-06T00:00:00Z");
            const lastTranslatedBefore = new Date("2026-02-06T00:00:00Z");
            const firstTranslatedAfter = new Date("2026-01-07T00:00:00Z");
            const firstTranslatedBefore = new Date("2026-02-07T00:00:00Z");
            const keyword = { searchText: "year", caseSensitive: true, entireStringMatch: false, searchType: KeywordSearchType.BASIC };
            const sourceKeyword = { searchText: "src", searchType: KeywordSearchType.EXACT_MATCH };
            const translationKeyword = { searchText: "tgt", searchType: KeywordSearchType.REGEX };
            const tags = { tags: ["tag1"], matchAllTags: true, noTags: false };
            const searchOptions = {
                highlightMatches: false,
                searchDuplicates: true,
                translationEqSource: false,
                requestedResultsCount: 500
            };

            const filter = new CreateStringSearchFilterParameters()
                .setTmUids(["tm1"])
                .setSourceLocaleIds(["en-US"])
                .setTranslationLocaleIds(["fr-FR"])
                .setKeyword(keyword)
                .setSourceKeyword(sourceKeyword)
                .setTranslationKeyword(translationKeyword)
                .setLeverageType(LeverageType.PUBLISHED)
                .setHashcodes(["hash1"])
                .setSmtHashcodes(["smt1"])
                .setTranslatorUids(["translator1"])
                .setTranslationDateRange(translationDateRangeStart, translationDateRangeEnd)
                .setEditorUids(["editor1"])
                .setEditDateRange(editDateRangeStart, editDateRangeEnd)
                .setReviewerUids(["reviewer1"])
                .setReviewDateRange(reviewDateRangeStart, reviewDateRangeEnd)
                .setAuthorizerUids(["authorizer1"])
                .setAuthorizationDateRange(authorizationDateRangeStart, authorizationDateRangeEnd)
                .setIngestedDateRange(ingestedDateRangeStart, ingestedDateRangeEnd)
                .setVariants(["variant1"])
                .setProjectUids(["project1"])
                .setExternalStep(true)
                .setUrls(["https://example.com"])
                .setFileNames(["file1.xml"])
                .setKeys(["key1"])
                .setDomains(["domain1"])
                .setTmxFileNames(["tmx1.tmx"])
                .setSources([SourceType.TMX])
                .setTranslationQualities([TuTranslationQualityType.HUMAN])
                .setFirstTranslatorUids(["firstTranslator1"])
                .setLastTranslatedRange(lastTranslatedAfter, lastTranslatedBefore)
                .setFirstTranslatedRange(firstTranslatedAfter, firstTranslatedBefore)
                .setTags(tags)
                .setOfflineReportUids(["offlineReport1"])
                .setSearchOptions(searchOptions);

            assert.deepEqual(filter.export(), {
                tmUids: ["tm1"],
                sourceLocaleIds: ["en-US"],
                translationLocaleIds: ["fr-FR"],
                keyword,
                sourceKeyword,
                translationKeyword,
                leverageType: "PUBLISHED",
                hashcodes: ["hash1"],
                smtHashcodes: ["smt1"],
                translatorUids: ["translator1"],
                translationDateRangeStart,
                translationDateRangeEnd,
                editorUids: ["editor1"],
                editDateRangeStart,
                editDateRangeEnd,
                reviewerUids: ["reviewer1"],
                reviewDateRangeStart,
                reviewDateRangeEnd,
                authorizerUids: ["authorizer1"],
                authorizationDateRangeStart,
                authorizationDateRangeEnd,
                ingestedDateRangeStart,
                ingestedDateRangeEnd,
                variants: ["variant1"],
                projectUids: ["project1"],
                externalStep: true,
                urls: ["https://example.com"],
                fileNames: ["file1.xml"],
                keys: ["key1"],
                domains: ["domain1"],
                tmxFileNames: ["tmx1.tmx"],
                sources: ["TMX"],
                translationQualities: ["HUMAN"],
                firstTranslatorUids: ["firstTranslator1"],
                lastTranslatedAfter,
                lastTranslatedBefore,
                firstTranslatedAfter,
                firstTranslatedBefore,
                tags,
                offlineReportUids: ["offlineReport1"],
                searchOptions
            });
        });
    });
});
