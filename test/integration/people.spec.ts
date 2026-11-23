import dotenv from "dotenv";
import assert from "assert";
import { SmartlingPeopleApi } from "../../api/people/index";
import { TeamViewFilterParameters } from "../../api/people/params/team-view-filter-parameters";
import { PeopleRole } from "../../api/people/params/people-role";
import { PeopleSortProperty } from "../../api/people/params/people-sort-property";
import { PeopleSortDirection } from "../../api/people/params/people-sort-direction";
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

        assert.ok(first, "Test account must have at least one user");
        assert.strictEqual(typeof first.userUid, "string");
        assert.ok("offsetToken" in all);

        const users = await peopleApi.searchAccountUsers(
            accountUid, new TeamViewFilterParameters().setKeyword(first.email)
        );

        logResponse("searchAccountUsers (keyword)", users);
        assert.ok(users.items.some((user) => user.userUid === first.userUid));
    });

    // The service rejects application-level roles such as ROLE_ADMINISTRATOR with a 400
    // ("Unsupported AclLevel: APPLICATION"), so this uses a project-level role.
    it("filters by role and accepts a sort order", async () => {
        const users = await peopleApi.searchAccountUsers(
            accountUid,
            new TeamViewFilterParameters()
                .setUserRoles([PeopleRole.ROLE_PROJECT_MANAGER])
                .setSortProperty(PeopleSortProperty.EMAIL)
                .setSortDirection(PeopleSortDirection.ASC)
        );

        logResponse("searchAccountUsers (role filter, sorted)", users);
        assert.ok(users.items.length > 0);
        users.items.forEach((user) => {
            assert.ok(user.userRoles.some((role) => role.name === PeopleRole.ROLE_PROJECT_MANAGER));
        });
    });

    it("pages with the offset token", async () => {
        const firstPage = await peopleApi.searchAccountUsers(
            accountUid, new TeamViewFilterParameters().setLimit(1)
        );

        logResponse("searchAccountUsers (first page)", firstPage);
        assert.strictEqual(firstPage.items.length, 1);
        assert.ok(firstPage.offsetToken, "Test account must have more than one user");

        const secondPage = await peopleApi.searchAccountUsers(
            accountUid,
            new TeamViewFilterParameters()
                .setLimit(1)
                .setOffsetToken(firstPage.offsetToken as string)
        );

        logResponse("searchAccountUsers (second page)", secondPage);
        assert.strictEqual(secondPage.items.length, 1);
        assert.notStrictEqual(secondPage.items[0].userUid, firstPage.items[0].userUid);
    });
});
