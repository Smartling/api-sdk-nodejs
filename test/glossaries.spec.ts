import sinon from "sinon";
import { SmartlingGlossariesApi } from "../api/glossaries/index";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingAuthApi } from "../api/auth/index";
import { SearchGlossariesParameters } from "../api/glossaries/params/search-glossaries-parameters";

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
    });
});
