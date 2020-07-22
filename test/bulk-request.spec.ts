import sinon from "sinon";
import assert from "assert";
import { BulkRequestServiceApi } from "../api/bulk-request";
import { RequestTranslation } from "../api/bulk-request/parameters/request-translation";
import { Asset } from "../api/bulk-request/models/asset";
import { Search } from "../api/bulk-request/parameters/search";

const {loggerMock, authMock, responseMock} = require("./mock");

describe("SmartlingBulkRequestServiceApi class tests.", () => {
    let bulkRequestServiceApi: BulkRequestServiceApi;
    let bulkRequestServiceApiFetchStub;
    let bulkRequestServiceApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        bulkRequestServiceApi = new BulkRequestServiceApi(authMock, loggerMock, "https://test.com");
        bulkRequestServiceApiFetchStub = sinon.stub(bulkRequestServiceApi, "fetch");
        bulkRequestServiceApiUaStub = sinon.stub(bulkRequestServiceApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        bulkRequestServiceApiUaStub.returns("test_user_agent");
        bulkRequestServiceApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        bulkRequestServiceApiFetchStub.restore();
        responseMockJsonStub.restore();
        bulkRequestServiceApiUaStub.restore();
    });

    function getAsset(): Asset {
        return {
            assetId: {
                assetType: "type",
                spaceId: "space",
                assetId: "id",
            },
            bulkTranslationRequestActionAssetUid: "uid",
            title: "title",
        };
    }

    describe("Should create parameters", () => {
        it("Should export request translation", () => {
            const requestTranslationParameters: RequestTranslation = new RequestTranslation();

            const asset = getAsset();

            requestTranslationParameters.setAssets([asset])
                .setAuthorize(true)
                .setBulkActionUid("bulkActionUid")
                .setLocaleIds(["test"])
                .setTranslationJobUid("translationJobUid")

            assert.deepEqual(
                {
                    assets: [asset],
                    authorize: true,
                    bulkActionUid: "bulkActionUid",
                    localeIds: ["test"],
                    translationJobUid: "translationJobUid",
                },
                requestTranslationParameters.export()
            );
        });
        it("should export search with defaults", function () {
            assert.deepEqual(
                {
                    limit: 100,
                    orderBy: "ASC",
                },
                new Search().export()
            );
        });
        it("Should export search after parameters set", () => {
            const searchParameters: Search = new Search();

            const filter = {
                someProperty: "someValue",
            }

            const offset = "13";
            const limit = 51;
            const sortBy = "test";
            searchParameters.setOffset(offset)
                .setFilter(filter)
                .setLimit(limit)
                .setSort(sortBy)

            assert.deepEqual(
                {
                    offset,
                    limit,
                    filter,
                    sortBy,
                    orderBy: "ASC",
                },
                searchParameters.export()
            );
        });
    });

    describe("Methods", () => {
        it("Should search", async () => {
            const filter = {
                someProperty: "someValue",
            }

            const offset = "13";
            const limit = 51;
            const sort = "test";

            const search: Search = new Search();
            search.setOffset(offset);
            search.setLimit(limit);
            search.setSort(sort);
            search.setFilter(filter);

            const connector = "connector";
            const projectUid = "testProjectUid";
            await bulkRequestServiceApi.search(connector, projectUid, search);

            sinon.assert.calledOnce(bulkRequestServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                bulkRequestServiceApiFetchStub,
                `https://test.com/${connector}-api/v2/projects/${projectUid}/bulk/search`,
                {
                    body: `{"limit":${limit},"orderBy":"ASC","offset":"${offset}","sortBy":"${sort}","filter":${JSON.stringify(filter)}}`,
                    headers: {
                        "Authorization": "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });
        it("Should request translations", async () => {

            const requestTranslation: RequestTranslation = new RequestTranslation();
            const translationJobUid = "translationJobUid";
            const localeIds = ["test"];
            const bulkActionUid = "bulkActionUid";
            const authorize = true;
            const assets = [getAsset()];

            requestTranslation.setTranslationJobUid(translationJobUid);
            requestTranslation.setLocaleIds(localeIds);
            requestTranslation.setBulkActionUid(bulkActionUid);
            requestTranslation.setAuthorize(authorize);
            requestTranslation.setAssets(assets)

            const connector = "connector";
            const projectUid = "testProjectUid";
            await bulkRequestServiceApi.requestTranslation(connector, projectUid, requestTranslation);

            sinon.assert.calledOnce(bulkRequestServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                bulkRequestServiceApiFetchStub,
                `https://test.com/${connector}-api/v2/projects/${projectUid}/bulk/translation-requests`,
                {
                    body: `{"translationJobUid":"${translationJobUid}","localeIds":${JSON.stringify(localeIds)},"bulkActionUid":"${bulkActionUid}","authorize":${JSON.stringify(authorize)},"assets":${JSON.stringify(assets)}}`,
                    headers: {
                        "Authorization": "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });
    });
});
