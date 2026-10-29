import dotenv from "dotenv";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../../api/builder/index";
import { SmartlingBaseApi } from "../../api/base/index";
import { AccessTokenProvider } from "../../api/auth/access-token-provider";
import { SmartlingJobsApi } from "../../api/jobs/index";
import { SmartlingProjectsApi } from "../../api/projects/index";
import { SmartlingFilesApi } from "../../api/files/index";
import { SmartlingStringsApi } from "../../api/strings/index";
import { CreateJobParameters } from "../../api/jobs/params/create-job-parameters";
import { UpdateJobParameters } from "../../api/jobs/params/update-job-parameters";
import { ListJobsParameters } from "../../api/jobs/params/list-jobs-parameters";
import { SearchJobsParameters } from "../../api/jobs/params/search-jobs-parameters";
import { AddFileParameters } from "../../api/jobs/params/add-file-parameters";
import { RemoveFileParameters } from "../../api/jobs/params/remove-file-parameters";
import { ListJobFilesParameters } from "../../api/jobs/params/list-job-files-parameters";
import { AddStringsToJobParameters } from "../../api/jobs/params/add-strings-to-job-parameters";
import { RemoveStringsFromJobParameters } from "../../api/jobs/params/remove-strings-from-job-parameters";
import { AuthorizeJobParameters } from "../../api/jobs/params/authorize-job-parameters";
import { JobProgressParameters } from "../../api/jobs/params/job-progress-parameters";
import { FileProgressParameters } from "../../api/jobs/params/file-progress-parameters";
import { CancelJobParameters } from "../../api/jobs/params/cancel-job-parameters";
import { UploadFileParameters } from "../../api/files/params/upload-file-parameters";
import { FileType } from "../../api/files/params/file-type";
import { FetchSourceStringsParameters } from "../../api/strings/params/fetch-source-strings-parameters";
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
    let stringsApi: SmartlingStringsApi;
    let projectId: string;
    let targetLocaleIds: string[];
    let jobName: string;
    let jobUid: string;
    let secondJobUid: string;
    let fileUri: string;
    let hashcode: string;

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
        stringsApi = buildApi(SmartlingStringsApi);
    });

    before(async () => {
        const projects = await projectsApi.listProjects(accountUid);

        logResponse("listProjects", projects);
        assert.ok(projects.items.length > 0, "Test account must have at least one project to run Jobs integration tests");

        ({ projectId } = projects.items[0]);

        const project = await projectsApi.getProjectDetails(projectId);

        logResponse("getProjectDetails", project);

        targetLocaleIds = project.targetLocales.map((locale) => locale.localeId);

        jobName = `api-sdk-nodejs jobs integration test ${suiteId}`;

        const job = await jobsApi.createJob(
            projectId,
            new CreateJobParameters()
                .setName(jobName)
                .setDescription("Created by api-sdk-nodejs integration tests")
                .setTargetLocaleIds(targetLocaleIds)
        );

        logResponse("createJob", job);
        ({ translationJobUid: jobUid } = job);

        const secondJob = await jobsApi.createJob(
            projectId,
            new CreateJobParameters()
                .setName(`${jobName} (move target)`)
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

        const sourceStrings = await stringsApi.getSourceStrings(
            projectId, new FetchSourceStringsParameters().setFileUri(fileUri)
        );

        logResponse("getSourceStrings", sourceStrings);
        assert.ok(sourceStrings.items.length > 0, "Uploaded file must expose at least one source string");

        ([{ hashcode }] = sourceStrings.items);
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

    it("gets a job", async () => {
        const job = await jobsApi.getJob(projectId, jobUid);

        logResponse("getJob", job);
        assert.strictEqual(job.translationJobUid, jobUid);
        assert.strictEqual(job.jobName, jobName);
        assert.ok(job.createdDate instanceof Date);
    });

    it("updates a job", async () => {
        // The update endpoint replaces the whole resource, so resend the name it was created with.
        const job = await jobsApi.updateJob(
            projectId,
            jobUid,
            new UpdateJobParameters()
                .setName(jobName)
                .setDescription("Updated by api-sdk-nodejs integration tests")
        );

        logResponse("updateJob", job);
        assert.strictEqual(job.translationJobUid, jobUid);
        assert.strictEqual(job.description, "Updated by api-sdk-nodejs integration tests");
    });

    it("lists jobs", async () => {
        const jobs = await jobsApi.listJobs(projectId, new ListJobsParameters().setName(jobName));

        logResponse("listJobs", jobs);
        assert.ok(jobs.items.some((job) => job.translationJobUid === jobUid));
        assert.ok(jobs.totalCount >= 1);
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

    it("searches jobs by translationJobUid and by fileUri", async () => {
        const byUid = await jobsApi.searchJobs(
            projectId, new SearchJobsParameters().setTranslationJobUids([jobUid])
        );

        logResponse("searchJobs (by translationJobUid)", byUid);
        assert.ok(byUid.items.some((job) => job.translationJobUid === jobUid));

        const byFile = await jobsApi.searchJobs(
            projectId, new SearchJobsParameters().setFileUris([fileUri])
        );

        logResponse("searchJobs (by fileUri)", byFile);
        assert.ok(byFile.items.some((job) => job.translationJobUid === jobUid));
    });

    it("lists the files of a job", async () => {
        const files = await jobsApi.getJobFiles(projectId, jobUid, new ListJobFilesParameters());

        logResponse("getJobFiles", files);
        assert.ok(files.items.some((file) => file.uri === fileUri));
    });

    it("removes strings from a job and adds them back", async () => {
        const removed = await jobsApi.removeStringsFromJob(
            projectId,
            jobUid,
            new RemoveStringsFromJobParameters()
                .setHashcodes([hashcode])
                .setTargetLocaleIds(targetLocaleIds)
        );

        logResponse("removeStringsFromJob", removed);
        assert.strictEqual(typeof removed.successCount, "number");
        assert.strictEqual(typeof removed.failCount, "number");

        const added = await jobsApi.addStringsToJob(
            projectId,
            jobUid,
            new AddStringsToJobParameters()
                .setHashcodes([hashcode])
                .setTargetLocaleIds(targetLocaleIds)
        );

        logResponse("addStringsToJob", added);
        assert.strictEqual(typeof added.successCount, "number");
        assert.strictEqual(typeof added.failCount, "number");
    });

    it("authorizes a job", async () => {
        const authorized = await jobsApi.authorizeJob(
            projectId, jobUid, new AuthorizeJobParameters()
        );

        logResponse("authorizeJob", authorized);
        assert.ok(authorized !== undefined);
    });

    it("gets job progress", async () => {
        const progress = await jobsApi.getJobProgress(
            projectId, jobUid, new JobProgressParameters()
        );

        logResponse("getJobProgress", progress);
        assert.ok(progress.progress);
        assert.ok(Array.isArray(progress.contentProgressReport));
        assert.ok(Array.isArray(progress.summaryReport));
    });

    it("gets job file progress", async () => {
        const progress = await jobsApi.getJobFileProgress(
            projectId, jobUid, new FileProgressParameters().setFileUri(fileUri)
        );

        logResponse("getJobFileProgress", progress);
        assert.ok(progress.progress);
        assert.ok(Array.isArray(progress.contentProgressReport));
    });

    it("adds a file to another job with moveEnabled and removes it", async () => {
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

    // closeJob is not covered: a job can only be closed once it is COMPLETED, which needs real
    // translation work and can't be reached from a throwaway test job.

    it("cancels and deletes a job", async () => {
        const job = await jobsApi.createJob(
            projectId,
            new CreateJobParameters()
                .setName(`${jobName} (disposable)`)
                .setTargetLocaleIds(targetLocaleIds)
        );

        logResponse("createJob (disposable)", job);

        await cancelAndDeleteJob(job.translationJobUid);

        const jobs = await jobsApi.searchJobs(
            projectId, new SearchJobsParameters().setTranslationJobUids([job.translationJobUid])
        );

        logResponse("searchJobs (after delete)", jobs);
        assert.ok(!jobs.items.some((item) => item.translationJobUid === job.translationJobUid));
    });
});
