import dotenv from "dotenv";
import assert from "assert";
import { SmartlingJobsApi } from "../../api/jobs/index";
import { SmartlingProjectsApi } from "../../api/projects/index";
import { SmartlingFilesApi } from "../../api/files/index";
import { SmartlingStringsApi } from "../../api/strings/index";
import { CreateJobParameters } from "../../api/jobs/params/create-job-parameters";
import { AddFileParameters } from "../../api/jobs/params/add-file-parameters";
import { RemoveFileParameters } from "../../api/jobs/params/remove-file-parameters";
import { ListJobFilesParameters } from "../../api/jobs/params/list-job-files-parameters";
import { CancelJobParameters } from "../../api/jobs/params/cancel-job-parameters";
import { AuthorizeJobParameters } from "../../api/jobs/params/authorize-job-parameters";
import { UpdateJobParameters } from "../../api/jobs/params/update-job-parameters";
import { ListJobsParameters } from "../../api/jobs/params/list-jobs-parameters";
import { SearchJobsParameters } from "../../api/jobs/params/search-jobs-parameters";
import { JobProgressParameters } from "../../api/jobs/params/job-progress-parameters";
import { FileProgressParameters } from "../../api/jobs/params/file-progress-parameters";
import { AddStringsToJobParameters } from "../../api/jobs/params/add-strings-to-job-parameters";
import { RemoveStringsFromJobParameters } from "../../api/jobs/params/remove-strings-from-job-parameters";
import { GetJobsWithProcessesParameters } from "../../api/jobs/params/get-jobs-with-processes-parameters";
import { FindJobsByStringsParameters } from "../../api/jobs/params/find-jobs-by-strings-parameters";
import { FetchSourceStringsParameters } from "../../api/strings/params/fetch-source-strings-parameters";
import { UploadFileParameters } from "../../api/files/params/upload-file-parameters";
import { FileType } from "../../api/files/params/file-type";
import { logResponse } from "./helpers/log-response";
import { buildApi } from "./helpers/build-api";

dotenv.config();

const accountUid = process.env.SMARTLING_ACCOUNT_UID as string;
const userId = process.env.SMARTLING_USER_ID as string;
const userSecret = process.env.SMARTLING_USER_SECRET as string;
const hasCredentials = Boolean(accountUid && userId && userSecret);

// closeJob is not covered: the service only closes a COMPLETED job, which the suite can't produce.
describe("SmartlingJobsApi integration tests.", function integrationSuite() {
    this.timeout(180000);

    let jobsApi: SmartlingJobsApi;
    let projectsApi: SmartlingProjectsApi;
    let filesApi: SmartlingFilesApi;
    let stringsApi: SmartlingStringsApi;
    let projectId: string;
    let targetLocaleIds: string[];
    let jobUid: string;
    let secondJobUid: string;
    let fileUri: string;

    const suiteId = Date.now();

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

    it("authorizes a job", async () => {
        const authorized = await jobsApi.authorizeJob(
            projectId, jobUid, new AuthorizeJobParameters()
        );

        logResponse("authorizeJob", authorized);
        assert.ok(authorized);
    });

    it("gets a job", async () => {
        const job = await jobsApi.getJob(projectId, jobUid);

        logResponse("getJob", job);
        assert.strictEqual(job.translationJobUid, jobUid);
    });

    it("updates a job", async () => {
        const description = "api-sdk-nodejs integration test description";
        const job = await jobsApi.updateJob(
            projectId,
            jobUid,
            new UpdateJobParameters()
                .setName(`api-sdk-nodejs jobs integration test ${suiteId}`)
                .setDescription(description)
                .setDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
        );

        logResponse("updateJob", job);
        assert.strictEqual(job.description, description);
    });

    it("lists jobs by name", async () => {
        const jobs = await jobsApi.listJobs(
            projectId, new ListJobsParameters().setName(`api-sdk-nodejs jobs integration test ${suiteId}`)
        );

        logResponse("listJobs", jobs);
        assert.ok(jobs.items.some((item) => item.translationJobUid === jobUid));
    });

    it("searches jobs by file uri", async () => {
        const jobs = await jobsApi.searchJobs(
            projectId, new SearchJobsParameters().setFileUris([fileUri])
        );

        logResponse("searchJobs", jobs);
        assert.ok(jobs.items.some((item) => item.translationJobUid === jobUid));
    });

    it("gets job progress", async () => {
        const progress = await jobsApi.getJobProgress(
            projectId, jobUid, new JobProgressParameters()
        );

        logResponse("getJobProgress", progress);
        assert.ok(progress.progress);
    });

    it("gets job file progress", async () => {
        const progress = await jobsApi.getJobFileProgress(
            projectId, jobUid, new FileProgressParameters().setFileUri(fileUri)
        );

        logResponse("getJobFileProgress", progress);
        assert.ok(progress.progress);
    });

    it("gets job locales completion dates", async () => {
        const dates = await jobsApi.getJobLocalesCompletionDates(projectId, jobUid);

        logResponse("getJobLocalesCompletionDates", dates);
        assert.ok(Array.isArray(dates.items));
    });

    it("gets the job schedule", async () => {
        const schedule = await jobsApi.getJobSchedule(projectId, jobUid);

        logResponse("getJobSchedule", schedule);
        assert.ok(Array.isArray(schedule.items));
    });

    it("gets jobs with an active process", async () => {
        const jobs = await jobsApi.getJobsWithActiveProcess(
            projectId, new GetJobsWithProcessesParameters().setTranslationJobUids([jobUid])
        );

        logResponse("getJobsWithActiveProcess", jobs);
        assert.ok(Array.isArray(jobs.items));
    });

    it("finds jobs by strings", async () => {
        const sourceStrings = await stringsApi.getSourceStrings(
            projectId, new FetchSourceStringsParameters().setFileUri(fileUri)
        );

        logResponse("getSourceStrings", sourceStrings);
        assert.ok(sourceStrings.items.length > 0);

        const hashcodes = sourceStrings.items.map((item) => item.hashcode);
        const jobs = await jobsApi.findJobsByStrings(
            projectId,
            new FindJobsByStringsParameters().setHashcodes(hashcodes).setLocaleIds(targetLocaleIds)
        );

        logResponse("findJobsByStrings", jobs);
        assert.strictEqual(typeof jobs.totalCount, "number");

        const found = jobs.items.find((item) => item.translationJobUid === jobUid);

        assert.ok(found);
        assert.strictEqual(typeof found.jobName, "string");
        assert.ok(found.dueDate === null || found.dueDate instanceof Date);
        assert.ok(found.hashcodesByLocale.length > 0);
        found.hashcodesByLocale.forEach((entry) => {
            assert.strictEqual(typeof entry.localeId, "string");
            assert.ok(entry.hashcodes.length > 0);
        });
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

    it("adds strings to and removes strings from a job", async () => {
        const sourceStrings = await stringsApi.getSourceStrings(
            projectId, new FetchSourceStringsParameters().setFileUri(fileUri)
        );
        const hashcodes = sourceStrings.items.map((item) => item.hashcode);

        const added = await jobsApi.addStringsToJob(
            projectId,
            secondJobUid,
            new AddStringsToJobParameters()
                .setHashcodes(hashcodes)
                .setTargetLocaleIds(targetLocaleIds)
                .setMoveEnabled(true)
        );

        logResponse("addStringsToJob", added);
        assert.strictEqual(typeof added.successCount, "number");

        const removed = await jobsApi.removeStringsFromJob(
            projectId,
            secondJobUid,
            new RemoveStringsFromJobParameters()
                .setHashcodes(hashcodes)
                .setTargetLocaleIds(targetLocaleIds)
        );

        logResponse("removeStringsFromJob", removed);
        assert.strictEqual(typeof removed.successCount, "number");
    });
});
