import dotenv from "dotenv";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../../api/builder/index";
import { SmartlingBaseApi } from "../../api/base/index";
import { AccessTokenProvider } from "../../api/auth/access-token-provider";
import { SmartlingJobsApi } from "../../api/jobs/index";
import { SmartlingProjectsApi } from "../../api/projects/index";
import { SmartlingFilesApi } from "../../api/files/index";
import { CreateJobParameters } from "../../api/jobs/params/create-job-parameters";
import { AddFileParameters } from "../../api/jobs/params/add-file-parameters";
import { RemoveFileParameters } from "../../api/jobs/params/remove-file-parameters";
import { ListJobFilesParameters } from "../../api/jobs/params/list-job-files-parameters";
import { CancelJobParameters } from "../../api/jobs/params/cancel-job-parameters";
import { UploadFileParameters } from "../../api/files/params/upload-file-parameters";
import { FileType } from "../../api/files/params/file-type";
import { logResponse } from "./helpers/log-response";

dotenv.config();

const baseSmartlingApiUrl = process.env.SMARTLING_API_BASE_URL || "https://api.smartling.com";
const accountUid = process.env.SMARTLING_ACCOUNT_UID as string;
const userId = process.env.SMARTLING_USER_ID as string;
const userSecret = process.env.SMARTLING_USER_SECRET as string;
const hasCredentials = Boolean(accountUid && userId && userSecret);

describe("SmartlingJobsApi integration tests.", function integrationSuite() {
    this.timeout(180000);

    let jobsApi: SmartlingJobsApi;
    let projectsApi: SmartlingProjectsApi;
    let filesApi: SmartlingFilesApi;
    let projectId: string;
    let targetLocaleIds: string[];
    let jobUid: string;
    let secondJobUid: string;
    let fileUri: string;

    const suiteId = Date.now();

    function buildApi<T extends SmartlingBaseApi>(
        apiClass: new (baseUrl: string, authApi: AccessTokenProvider, logger) => T
    ): T {
        return new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret)
            .build(apiClass);
    }

    async function cancelAndDeleteJob(translationJobUid: string): Promise<void> {
        // A job can only be deleted once it's CANCELLED.
        await jobsApi.cancelJob(
            projectId,
            translationJobUid,
            new CancelJobParameters().setReason("api-sdk-nodejs integration test cleanup")
        );
        await jobsApi.deleteJob(projectId, translationJobUid);
    }

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping Jobs integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET in .env");
            this.skip();
        }

        jobsApi = buildApi(SmartlingJobsApi);
        projectsApi = buildApi(SmartlingProjectsApi);
        filesApi = buildApi(SmartlingFilesApi);
    });

    before(async () => {
        const projects = await projectsApi.listProjects(accountUid);

        logResponse("listProjects", projects);
        assert.ok(projects.items.length > 0, "Test account must have at least one project to run Jobs integration tests");

        ({ projectId } = projects.items[0]);

        const project = await projectsApi.getProjectDetails(projectId);

        logResponse("getProjectDetails", project);

        targetLocaleIds = project.targetLocales.map((locale) => locale.localeId);

        const job = await jobsApi.createJob(
            projectId,
            new CreateJobParameters()
                .setName(`api-sdk-nodejs jobs integration test ${suiteId}`)
                .setTargetLocaleIds(targetLocaleIds)
        );

        logResponse("createJob", job);
        ({ translationJobUid: jobUid } = job);

        const secondJob = await jobsApi.createJob(
            projectId,
            new CreateJobParameters()
                .setName(`api-sdk-nodejs jobs integration test ${suiteId} (move target)`)
                .setTargetLocaleIds(targetLocaleIds)
        );

        logResponse("createJob (move target)", secondJob);
        ({ translationJobUid: secondJobUid } = secondJob);

        fileUri = `api-sdk-nodejs-jobs-integration-test-${suiteId}.json`;

        const uploaded = await filesApi.uploadFile(
            projectId,
            new UploadFileParameters()
                .setFileUri(fileUri)
                .setFileType(FileType.JSON)
                .setFileContent(JSON.stringify({
                    greeting: "Hello, welcome to our service!",
                    farewell: "Thank you for using our application, we hope to see you again soon."
                }))
        );

        logResponse("uploadFile", uploaded);
    });

    after(async () => {
        if (jobUid) {
            await cancelAndDeleteJob(jobUid);
        }

        if (secondJobUid) {
            await cancelAndDeleteJob(secondJobUid);
        }

        if (fileUri) {
            await filesApi.deleteFile(projectId, fileUri);
        }
    });

    it("adds a file to a job", async () => {
        const added = await jobsApi.addFileToJob(
            projectId,
            jobUid,
            new AddFileParameters().setFileUri(fileUri).setTargetLocaleIds(targetLocaleIds)
        );

        logResponse("addFileToJob", added);
        assert.strictEqual(typeof added.successCount, "number");
        assert.strictEqual(typeof added.failCount, "number");
    });

    it("moves a file's strings from another job with moveEnabled", async () => {
        const added = await jobsApi.addFileToJob(
            projectId,
            secondJobUid,
            new AddFileParameters()
                .setFileUri(fileUri)
                .setTargetLocaleIds(targetLocaleIds)
                .setMoveEnabled(true)
        );

        logResponse("addFileToJob (moveEnabled)", added);
        assert.strictEqual(typeof added.successCount, "number");
        assert.strictEqual(typeof added.failCount, "number");

        const files = await jobsApi.getJobFiles(
            projectId, secondJobUid, new ListJobFilesParameters()
        );

        logResponse("getJobFiles (move target)", files);
        assert.ok(files.items.some((file) => file.uri === fileUri));

        const removed = await jobsApi.removeFileFromJob(
            projectId, secondJobUid, new RemoveFileParameters().setFileUri(fileUri)
        );

        logResponse("removeFileFromJob", removed);
        assert.strictEqual(typeof removed.successCount, "number");
        assert.strictEqual(typeof removed.failCount, "number");
    });
});
