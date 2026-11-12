import dotenv from "dotenv";
import assert from "assert";
import { SmartlingProjectsApi } from "../../api/projects/index";
import { SmartlingLocalesApi } from "../../api/locales/index";
import { CreateProjectParameters } from "../../api/projects/params/create-project-parameters";
import { RenameProjectParameters } from "../../api/projects/params/rename-project-parameters";
import { UpdateProjectDescriptionParameters } from "../../api/projects/params/update-project-description-parameters";
import { CreateTargetLocaleParameters } from "../../api/projects/params/create-target-locale-parameters";
import { GetAccountProjectTypesParameters } from "../../api/projects/params/get-account-project-types-parameters";
import { ProjectTypeGroupCode } from "../../api/projects/params/project-type-group-code";
import { CopyProjectParameters } from "../../api/projects/params/copy-project-parameters";
import { ProjectCopyProcessState } from "../../api/projects/dto/project-copy-process-state";
import { logResponse } from "./helpers/log-response";
import { buildApi } from "./helpers/build-api";

function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

dotenv.config();

const accountUid = process.env.SMARTLING_ACCOUNT_UID as string;
const userId = process.env.SMARTLING_USER_ID as string;
const userSecret = process.env.SMARTLING_USER_SECRET as string;
const hasCredentials = Boolean(accountUid && userId && userSecret);

describe("SmartlingProjectsApi integration tests.", function integrationSuite() {
    this.timeout(180000);

    let projectsApi: SmartlingProjectsApi;
    let localesApi: SmartlingLocalesApi;
    let createdProjectId: string;
    let copiedProjectId: string;
    let projectTypeCode: string;
    let originalLocaleId: string;
    let targetLocaleId: string;
    let extraLocaleId: string;

    const suiteId = Date.now();

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping Projects integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET in .env");
            this.skip();
        }

        projectsApi = buildApi(SmartlingProjectsApi);
        localesApi = buildApi(SmartlingLocalesApi);
    });

    before(async () => {
        // Mirror an existing project's own type/locales rather than hardcoding any -
        // projectTypeCode must be one the test account is allowed to create, and locale ids
        // must exist in the system, both of which an already-successful real project proves.
        const existingProjects = await projectsApi.listProjects(accountUid);

        logResponse("listProjects", existingProjects);
        assert.ok(existingProjects.items.length > 0, "Test account must have at least one project to run Projects integration tests");

        const sampleProject = await projectsApi.getProjectDetails(
            existingProjects.items[0].projectId,
            true
        );

        logResponse("getProjectDetails (sample project)", sampleProject);
        assert.ok(sampleProject.targetLocales.length > 0, "Sample project must have at least one target locale");

        ({ projectTypeCode, sourceLocaleId: originalLocaleId } = sampleProject);
        ({ localeId: targetLocaleId } = sampleProject.targetLocales[0]);

        const usedLocaleIds = new Set([
            originalLocaleId,
            ...sampleProject.targetLocales.map((locale) => locale.localeId)
        ]);
        const allLocales = await localesApi.getLocales();

        logResponse("getLocales", allLocales);
        const unusedLocale = allLocales.items.find((locale) => !usedLocaleIds.has(locale.localeId));

        assert.ok(unusedLocale, "Could not find a locale that isn't already used by the sample project");
        extraLocaleId = unusedLocale.localeId;

        const created = await projectsApi.createProject(
            accountUid,
            new CreateProjectParameters()
                .setProjectName(`api-sdk-nodejs projects integration test ${suiteId}`)
                .setProjectTypeCode(projectTypeCode)
                .setOriginalLocaleId(originalLocaleId)
                .setTranslationLocaleIds([targetLocaleId])
        );

        logResponse("createProject", created);
        ({ projectUid: createdProjectId } = created);
    });

    after(async () => {
        if (copiedProjectId) {
            await projectsApi.archiveProject(copiedProjectId);
        }

        if (createdProjectId) {
            await projectsApi.archiveProject(createdProjectId);
        }
    });

    it("gets details of the created project", async () => {
        const details = await projectsApi.getProjectDetails(createdProjectId);

        logResponse("getProjectDetails", details);
        assert.strictEqual(details.projectId, createdProjectId);
        assert.strictEqual(details.sourceLocaleId, originalLocaleId);
        assert.ok(details.targetLocales.some((locale) => locale.localeId === targetLocaleId));
    });

    it("updates the project description", async () => {
        const description = `api-sdk-nodejs integration test description ${suiteId}`;
        const updated = await projectsApi.updateProjectDescription(
            createdProjectId,
            new UpdateProjectDescriptionParameters().setDescription(description)
        );

        logResponse("updateProjectDescription", updated);
        assert.strictEqual(updated.description, description);
    });

    it("renames the project", async () => {
        const newName = `api-sdk-nodejs projects integration test ${suiteId} (renamed)`;
        const renamed = await projectsApi.renameProject(
            createdProjectId,
            new RenameProjectParameters().setProjectName(newName)
        );

        logResponse("renameProject", renamed);
        assert.strictEqual(renamed.projectName, newName);
    });

    it("adds, lists, and removes a target locale", async () => {
        const withNewLocale = await projectsApi.createTargetLocale(
            createdProjectId,
            new CreateTargetLocaleParameters().setLocaleId(extraLocaleId)
        );

        logResponse("createTargetLocale", withNewLocale);
        assert.ok(withNewLocale.targetLocales.some((locale) => locale.localeId === extraLocaleId));

        const targetLocales = await projectsApi.getTargetLocales(createdProjectId);

        logResponse("getTargetLocales", targetLocales);
        assert.ok(targetLocales.items.some((locale) => locale.localeId === extraLocaleId));

        await projectsApi.deleteTargetLocale(createdProjectId, extraLocaleId);

        const targetLocalesAfterDelete = await projectsApi.getTargetLocales(createdProjectId);

        logResponse("getTargetLocales (after delete)", targetLocalesAfterDelete);
        // Deleting a target locale disables it rather than removing it from the list.
        const deletedLocale = targetLocalesAfterDelete.items
            .find((locale) => locale.localeId === extraLocaleId);

        assert.ok(deletedLocale);
        assert.strictEqual(deletedLocale.enabled, false);
    });

    it("gets account project types, optionally filtered by group code", async () => {
        const allTypes = await projectsApi.getAccountProjectTypes(accountUid);

        logResponse("getAccountProjectTypes", allTypes);
        assert.ok(allTypes.items.length > 0);
        assert.ok(allTypes.items.some((type) => type.projectTypeCode === projectTypeCode));

        const connectorTypesParams = new GetAccountProjectTypesParameters()
            .setProjectTypeGroupCode(ProjectTypeGroupCode.CONNECTOR);
        const connectorTypes = await projectsApi.getAccountProjectTypes(
            accountUid,
            connectorTypesParams
        );

        logResponse("getAccountProjectTypes (CONNECTOR)", connectorTypes);
        assert.ok(connectorTypes.items.length > 0);
        const isConnectorType = (type) => (
            type.projectTypeGroupCode === ProjectTypeGroupCode.CONNECTOR
        );

        assert.ok(connectorTypes.items.every(isConnectorType));
    });

    async function waitForCopyCompletion(processUid: string) {
        // The real API uses IN_PROGRESS and COMPLETED, not the OPEN/CLOSED/FAILED the spec
        // documents - confirmed live, so all five are treated as valid, with only
        // COMPLETED/CLOSED/FAILED considered terminal.
        const terminalStates = [
            ProjectCopyProcessState.COMPLETED,
            ProjectCopyProcessState.CLOSED,
            ProjectCopyProcessState.FAILED
        ];

        for (let attempt = 0; attempt < 60; attempt += 1) {
            /* eslint-disable-next-line no-await-in-loop */
            const status = await projectsApi.getProjectCopyRequestStatus(
                createdProjectId,
                processUid
            );

            logResponse("getProjectCopyRequestStatus", status);

            if (terminalStates.includes(status.processState)) {
                return status;
            }

            /* eslint-disable-next-line no-await-in-loop */
            await delay(3000);
        }

        throw new Error(`Timed out waiting for copy request ${processUid} to complete`);
    }

    it("copies the project and polls the copy request status to completion", async function test() {
        this.timeout(240000);

        const copyName = `api-sdk-nodejs projects integration test ${suiteId} (copy)`;
        const copyStarted = await projectsApi.copyProject(
            createdProjectId,
            new CopyProjectParameters()
                .setProjectName(copyName)
                .setTargetLocaleIds([targetLocaleId])
        );

        logResponse("copyProject", copyStarted);
        assert.ok(copyStarted.processUid);

        const status = await waitForCopyCompletion(copyStarted.processUid);

        assert.strictEqual(status.processUid, copyStarted.processUid);
        assert.notStrictEqual(status.processState, ProjectCopyProcessState.FAILED);
        assert.ok(status.newProjectUid);
        assert.ok(status.createdDate instanceof Date);
        assert.ok(status.modifiedDate instanceof Date);
        assert.ok(status.processStatistics);

        ({ newProjectUid: copiedProjectId } = status);
    });

    it("archives and unarchives the project", async () => {
        const archived = await projectsApi.archiveProject(createdProjectId);

        logResponse("archiveProject", archived);
        assert.strictEqual(archived.archived, true);

        const unarchived = await projectsApi.unarchiveProject(createdProjectId);

        logResponse("unarchiveProject", unarchived);
        assert.strictEqual(unarchived.archived, false);
    });
});
