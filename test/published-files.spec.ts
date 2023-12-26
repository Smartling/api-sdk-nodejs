import sinon from "sinon";
import { authMock, loggerMock, responseMock } from "./mock";
import { SmartlingAuthApi } from "../api/auth";
import { SmartlingPublishedFilesApi } from "../api/published-files";
import {
    GetRecentlyPublishedFilesParameters
} from "../api/published-files/params/get-recently-published-files-parameters";

describe("SmartlingPublishedFilesApi class tests.", () => {
    const projectId = "testProjectId";
    let publishedFilesApi: SmartlingPublishedFilesApi;
    let publishedFilesApiFetchStub;
    let publishedFilesApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        publishedFilesApi = new SmartlingPublishedFilesApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);
        publishedFilesApiFetchStub = sinon.stub(publishedFilesApi, "fetch");
        publishedFilesApiUaStub = sinon.stub(publishedFilesApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        publishedFilesApiUaStub.returns("test_user_agent");
        publishedFilesApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        publishedFilesApiFetchStub.restore();
        responseMockJsonStub.restore();
        publishedFilesApiUaStub.restore();
    });

    describe("Get recently published files", () => {
        let params: GetRecentlyPublishedFilesParameters;

        beforeEach(() => {
            params = new GetRecentlyPublishedFilesParameters();
        });

        it("Get all files published after date", async () => {
            const publishedAfter = new Date().toISOString();
            const encodedPublishedAfter = encodeURIComponent(publishedAfter);

            params
                .setPublishedAfter(publishedAfter);

            await publishedFilesApi.getRecentlyPublishedFiles(projectId, params);

            sinon.assert.calledOnce(publishedFilesApiFetchStub);
            sinon.assert.calledWithExactly(
                publishedFilesApiFetchStub,
                `https://test.com/published-files-api/v2/projects/${projectId}/files/list/recently-published?publishedAfter=${encodedPublishedAfter}`,
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

        it("Get all files published after date with all params", async () => {
            const publishedAfter = new Date().toISOString();
            const encodedPublishedAfter = encodeURIComponent(publishedAfter);

            params
                .setPublishedAfter(publishedAfter)
                .setFileUris(new Array<string>("testFileUri1", "testFileUri2"))
                .setLocaleIds(new Array<string>("fr-CA", "de-DE"))
                .setOffset(1)
                .setLimit(10);

            await publishedFilesApi.getRecentlyPublishedFiles(projectId, params);

            sinon.assert.calledOnce(publishedFilesApiFetchStub);
            sinon.assert.calledWithExactly(
                publishedFilesApiFetchStub,
                `https://test.com/published-files-api/v2/projects/${projectId}/files/list/recently-published?publishedAfter=${encodedPublishedAfter}&fileUris=testFileUri1&fileUris=testFileUri2&localeIds=fr-CA&localeIds=de-DE&offset=1&limit=10`,
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
    });
});
