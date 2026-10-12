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
import { streamToString } from "./stream-to-string";

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
                json: async (): Promise<unknown> => ({
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
                json: async (): Promise<unknown> => ({
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

        it("Bulk export TM strings", async () => {
            const graphQlResponseMock = {
                status: 200,
                json: async (): Promise<unknown> => ({
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
                json: async (): Promise<unknown> => ({
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
    });
});
