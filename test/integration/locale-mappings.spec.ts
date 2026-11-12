import dotenv from "dotenv";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../../api/builder/index";
import { SmartlingLocaleMappingsApi } from "../../api/locale-mappings/index";
import { SmartlingProjectsApi } from "../../api/projects/index";
import { CreateProjectParameters } from "../../api/projects/params/create-project-parameters";
import { LocaleMappingParameters } from "../../api/locale-mappings/params/locale-mapping-parameters";
import { ListLocaleMappingsParameters } from "../../api/locale-mappings/params/list-locale-mappings-parameters";
import { logResponse } from "./helpers/log-response";

dotenv.config();

const baseSmartlingApiUrl = process.env.SMARTLING_API_BASE_URL || "https://api.smartling.com";
const accountUid = process.env.SMARTLING_ACCOUNT_UID as string;
const userId = process.env.SMARTLING_USER_ID as string;
const userSecret = process.env.SMARTLING_USER_SECRET as string;
const hasCredentials = Boolean(accountUid && userId && userSecret);

describe("SmartlingLocaleMappingsApi integration tests.", function integrationSuite() {
    this.timeout(60000);

    let localeMappingsApi: SmartlingLocaleMappingsApi;
    let projectsApi: SmartlingProjectsApi;
    let projectId: string;
    let accountMappingUid: string;
    let projectMappingUid: string;

    const suiteId = Date.now();
    const integrationId = `sdk-it-${suiteId}`.slice(0, 30);
    const externalLocaleId = `sdk-it-${suiteId}`;

    function mappingParams(description: string): LocaleMappingParameters {
        return new LocaleMappingParameters()
            .setExternalLocaleId(externalLocaleId)
            .setExternalLocaleDescription(description)
            .setExternalLocaleMetadata({ path: "/content/sdk-it" })
            .setSmartlingLocaleId("fr");
    }

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping LocaleMappings integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET in .env");
            this.skip();
        }

        const builder = () => new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret);

        localeMappingsApi = builder().build(SmartlingLocaleMappingsApi);
        projectsApi = builder().build(SmartlingProjectsApi);
    });

    before(async () => {
        const existingProjects = await projectsApi.listProjects(accountUid);

        assert.ok(existingProjects.items.length > 0, "Test account must have at least one project to run LocaleMappings integration tests");

        const sampleProject = await projectsApi.getProjectDetails(
            existingProjects.items[0].projectId,
            true
        );
        const created = await projectsApi.createProject(
            accountUid,
            new CreateProjectParameters()
                .setProjectName(`api-sdk-nodejs locale mappings integration test ${suiteId}`)
                .setProjectTypeCode(sampleProject.projectTypeCode)
                .setOriginalLocaleId(sampleProject.sourceLocaleId)
                .setTranslationLocaleIds([sampleProject.targetLocales[0].localeId])
        );

        logResponse("createProject", created);
        ({ projectUid: projectId } = created);
    });

    after(async () => {
        if (accountMappingUid) {
            await localeMappingsApi.deleteMappingForAccount(accountUid, accountMappingUid);
        }
        if (projectMappingUid) {
            await localeMappingsApi.deleteMappingForProject(projectId, projectMappingUid);
        }
        if (projectId) {
            await projectsApi.archiveProject(projectId);
        }
    });

    it("creates an account-level mapping scoped to an integration", async () => {
        const created = await localeMappingsApi.createMappingForAccount(
            accountUid,
            mappingParams("Account mapping"),
            integrationId
        );

        logResponse("createMappingForAccount", created);
        ({ localeMappingUid: accountMappingUid } = created);
        assert.ok(accountMappingUid);
        assert.strictEqual(created.externalLocaleId, externalLocaleId);
        assert.strictEqual(created.smartlingLocaleId, "fr");
    });

    it("creates a project-level mapping", async () => {
        const created = await localeMappingsApi.createMappingForProject(projectId, mappingParams("Project mapping"));

        logResponse("createMappingForProject", created);
        ({ localeMappingUid: projectMappingUid } = created);
        assert.ok(projectMappingUid);
        assert.strictEqual(created.externalLocaleDescription, "Project mapping");
    });

    it("gets an account-level mapping", async () => {
        const mapping = await localeMappingsApi.getMappingForAccount(accountUid, accountMappingUid);

        logResponse("getMappingForAccount", mapping);
        assert.strictEqual(mapping.localeMappingUid, accountMappingUid);
        assert.ok(mapping.created instanceof Date);
        assert.ok(mapping.modified instanceof Date);
    });

    it("gets a project-level mapping", async () => {
        const mapping = await localeMappingsApi.getMappingForProject(projectId, projectMappingUid);

        logResponse("getMappingForProject", mapping);
        assert.strictEqual(mapping.localeMappingUid, projectMappingUid);
    });

    it("lists account-level mappings filtered by integration", async () => {
        const list = await localeMappingsApi.listMappingsForAccount(
            accountUid,
            new ListLocaleMappingsParameters().setIntegrationId(integrationId).setLimit(10)
        );

        logResponse("listMappingsForAccount", list);
        assert.ok(list.items.some((mapping) => mapping.localeMappingUid === accountMappingUid));
    });

    it("lists project-level mappings", async () => {
        const list = await localeMappingsApi.listMappingsForProject(
            projectId,
            new ListLocaleMappingsParameters().setSortBy("created").setOrderBy("desc")
        );

        logResponse("listMappingsForProject", list);
        assert.ok(list.totalCount >= 1);
        assert.ok(list.items.some((mapping) => mapping.localeMappingUid === projectMappingUid));
    });

    it("updates an account-level mapping", async () => {
        const updated = await localeMappingsApi.updateMappingForAccount(
            accountUid,
            accountMappingUid,
            mappingParams("Account mapping updated")
        );

        logResponse("updateMappingForAccount", updated);
        assert.strictEqual(updated.externalLocaleDescription, "Account mapping updated");
    });

    it("updates a project-level mapping", async () => {
        const updated = await localeMappingsApi.updateMappingForProject(
            projectId,
            projectMappingUid,
            mappingParams("Project mapping updated")
        );

        logResponse("updateMappingForProject", updated);
        assert.strictEqual(updated.externalLocaleDescription, "Project mapping updated");
    });

    it("deletes an account-level mapping", async () => {
        await localeMappingsApi.deleteMappingForAccount(accountUid, accountMappingUid);
        accountMappingUid = "";
    });

    it("deletes a project-level mapping", async () => {
        await localeMappingsApi.deleteMappingForProject(projectId, projectMappingUid);
        projectMappingUid = "";
    });
});
