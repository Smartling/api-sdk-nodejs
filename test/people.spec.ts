import assert from "assert";
import sinon from "sinon";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingPeopleApi } from "../api/people/index";
import { SmartlingAuthApi } from "../api/auth/index";
import { TeamViewFilterParameters } from "../api/people/params/team-view-filter-parameters";
import { PeopleRole } from "../api/people/params/people-role";
import { PeopleSortProperty } from "../api/people/params/people-sort-property";
import { PeopleSortDirection } from "../api/people/params/people-sort-direction";

describe("SmartlingPeopleApi class tests.", () => {
    const accountUid = "testAccountUid";
    let peopleApi;
    let fetchStub;
    let uaStub;
    let responseMockTextStub;

    beforeEach(() => {
        peopleApi = new SmartlingPeopleApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);
        fetchStub = sinon.stub(peopleApi, "fetch");
        uaStub = sinon.stub(peopleApi, "ua");
        responseMockTextStub = sinon.stub(responseMock, "text");

        uaStub.returns("test_user_agent");
        fetchStub.returns(responseMock);
        responseMockTextStub.returns(
            JSON.stringify({ response: { data: { items: [], offsetToken: null } } })
        );
    });

    afterEach(() => {
        fetchStub.restore();
        responseMockTextStub.restore();
        uaStub.restore();
    });

    const expectedRequest = (body: string) => ({
        body,
        headers: {
            Authorization: "test_token_type test_access_token",
            "Content-Type": "application/json",
            "User-Agent": "test_user_agent"
        },
        method: "post"
    });

    it("searches account users with filters", async () => {
        await peopleApi.searchAccountUsers(
            accountUid,
            new TeamViewFilterParameters().setKeyword("jane").setLimit(20)
        );

        sinon.assert.calledOnce(fetchStub);
        sinon.assert.calledWithExactly(
            fetchStub,
            `https://test.com/people-api/v3/accounts/${accountUid}/users`,
            expectedRequest("{\"keyword\":\"jane\",\"limit\":20}")
        );
    });

    it("searches account users without filters", async () => {
        await peopleApi.searchAccountUsers(accountUid);

        sinon.assert.calledOnce(fetchStub);
        sinon.assert.calledWithExactly(
            fetchStub,
            `https://test.com/people-api/v3/accounts/${accountUid}/users`,
            expectedRequest("{}")
        );
    });

    it("converts lastLogin to a Date and keeps null", async () => {
        responseMockTextStub.returns(JSON.stringify({
            response: {
                data: {
                    items: [
                        { userUid: "u1", lastLogin: "2026-01-14T09:30:00Z" },
                        { userUid: "u2", lastLogin: null }
                    ],
                    offsetToken: null
                }
            }
        }));

        const result = await peopleApi.searchAccountUsers(accountUid);

        assert.ok(result.items[0].lastLogin instanceof Date);
        assert.strictEqual(result.items[1].lastLogin, null);
        assert.strictEqual(result.offsetToken, null);
    });

    it("sends the offset token from a response in the next request", async () => {
        const responseBody = { response: { data: { items: [], offsetToken: "next-token" } } };

        responseMockTextStub.returns(JSON.stringify(responseBody));

        const page = await peopleApi.searchAccountUsers(
            accountUid, new TeamViewFilterParameters().setLimit(1)
        );

        await peopleApi.searchAccountUsers(
            accountUid,
            new TeamViewFilterParameters().setLimit(1).setOffsetToken(page.offsetToken)
        );

        sinon.assert.calledWithExactly(
            fetchStub.secondCall,
            `https://test.com/people-api/v3/accounts/${accountUid}/users`,
            expectedRequest("{\"limit\":1,\"offsetToken\":\"next-token\"}")
        );
    });

    it("serializes every filter", async () => {
        await peopleApi.searchAccountUsers(
            accountUid,
            new TeamViewFilterParameters()
                .setKeyword("jane")
                .setUserUids(["u1"])
                .setPending(false)
                .setUserRoles([PeopleRole.ROLE_ADMINISTRATOR])
                .setProjectUids(["p1"])
                .setAgencyUid("a1")
                .setSourceLocales(["en"])
                .setTargetLocales(["fr-FR"])
                .setWorkflowUid("w1")
                .setWorkflowStepUids(["s1"])
                .setLimit(5)
                .setOffsetToken("token")
                .setSortProperty(PeopleSortProperty.LAST_LOGIN)
                .setSortDirection(PeopleSortDirection.DESC)
        );

        sinon.assert.calledWithExactly(
            fetchStub,
            `https://test.com/people-api/v3/accounts/${accountUid}/users`,
            expectedRequest(JSON.stringify({
                keyword: "jane",
                userUids: ["u1"],
                pending: false,
                userRoles: ["ROLE_ADMINISTRATOR"],
                projectUids: ["p1"],
                agencyUid: "a1",
                sourceLocales: ["en"],
                targetLocales: ["fr-FR"],
                workflowUid: "w1",
                workflowStepUids: ["s1"],
                limit: 5,
                offsetToken: "token",
                sortProperty: "lastLogin",
                sortDirection: "DESC"
            }))
        );
    });

    it("encodes the account uid", async () => {
        await peopleApi.searchAccountUsers("account/with space");

        sinon.assert.calledWithExactly(
            fetchStub,
            "https://test.com/people-api/v3/accounts/account%2Fwith%20space/users",
            expectedRequest("{}")
        );
    });
});
