import dotenv from "dotenv";
import assert from "assert";
import { SmartlingPeopleApi } from "../../api/people/index";
import { TeamViewFilterParameters } from "../../api/people/params/team-view-filter-parameters";
import { logResponse } from "./helpers/log-response";
import { buildApi } from "./helpers/build-api";

dotenv.config();

const accountUid = process.env.SMARTLING_ACCOUNT_UID as string;
const userId = process.env.SMARTLING_USER_ID as string;
const userSecret = process.env.SMARTLING_USER_SECRET as string;
const hasCredentials = Boolean(accountUid && userId && userSecret);

describe("SmartlingPeopleApi integration tests.", function integrationSuite() {
    this.timeout(30000);

    let peopleApi: SmartlingPeopleApi;

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping People integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET in .env");
            this.skip();
        }

        peopleApi = buildApi(SmartlingPeopleApi);
    });

    it("searches account users without filters", async () => {
        const users = await peopleApi.searchAccountUsers(accountUid);

        logResponse("searchAccountUsers", users);
        assert.ok(users.items.length > 0);
    });

    it("searches account users by keyword", async () => {
        const all = await peopleApi.searchAccountUsers(
            accountUid, new TeamViewFilterParameters().setLimit(1)
        );
        const [first] = all.items;

        const users = await peopleApi.searchAccountUsers(
            accountUid, new TeamViewFilterParameters().setKeyword(first.email)
        );

        logResponse("searchAccountUsers (keyword)", users);
        assert.ok(users.items.some((user) => user.userUid === first.userUid));
    });
});
