import dotenv from "dotenv";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../../api/builder/index";
import { SmartlingEstimatesApi } from "../../api/estimates/index";
import { SmartlingJobsApi } from "../../api/jobs/index";
import { SmartlingProjectsApi } from "../../api/projects/index";
import { SmartlingFilesApi } from "../../api/files/index";
import { CreateJobParameters } from "../../api/jobs/params/create-job-parameters";
import { CancelJobParameters } from "../../api/jobs/params/cancel-job-parameters";
import { AddFileParameters } from "../../api/jobs/params/add-file-parameters";
import { AuthorizeJobParameters } from "../../api/jobs/params/authorize-job-parameters";
import { UploadFileParameters } from "../../api/files/params/upload-file-parameters";
import { FileType } from "../../api/files/params/file-type";
import { GenerateJobEstimateReportParameters } from "../../api/estimates/params/generate-job-estimate-report-parameters";
import { ListJobEstimateReportsParameters } from "../../api/estimates/params/list-job-estimate-reports-parameters";
import { ModifyEstimateReportTagsParameters } from "../../api/estimates/params/modify-estimate-report-tags-parameters";
import { JobContentType } from "../../api/estimates/params/job-content-type";
import { EstimateReportStatus } from "../../api/estimates/params/estimate-report-status";
import { logResponse } from "./helpers/log-response";

dotenv.config();

const baseSmartlingApiUrl = process.env.SMARTLING_API_BASE_URL || "https://api.smartling.com";
const accountUid = process.env.SMARTLING_ACCOUNT_UID as string;
const userId = process.env.SMARTLING_USER_ID as string;
const userSecret = process.env.SMARTLING_USER_SECRET as string;
const hasCredentials = Boolean(accountUid && userId && userSecret);

const TERMINAL_REPORT_STATUSES = [
    EstimateReportStatus.COMPLETED,
    EstimateReportStatus.FAILED,
    EstimateReportStatus.TIMEOUT,
    EstimateReportStatus.CANCELED,
    EstimateReportStatus.NOT_FOUND
];

function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

describe("SmartlingEstimatesApi integration tests.", function integrationSuite() {
    this.timeout(180000);

    let estimatesApi: SmartlingEstimatesApi;
    let jobsApi: SmartlingJobsApi;
    let projectsApi: SmartlingProjectsApi;
    let filesApi: SmartlingFilesApi;
    let projectId: string;
    let translationJobUid: string;
    let fileUri: string;

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping Estimates integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET in .env");
            this.skip();
        }

        estimatesApi = new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret)
            .build(SmartlingEstimatesApi);

        jobsApi = new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret)
            .build(SmartlingJobsApi);

        projectsApi = new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret)
            .build(SmartlingProjectsApi);

        filesApi = new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret)
            .build(SmartlingFilesApi);
    });

    before(async () => {
        const projects = await projectsApi.listProjects(accountUid);

        logResponse("listProjects", projects);
        assert.ok(projects.items.length > 0, "Test account must have at least one project to run Estimates integration tests");

        ({ projectId } = projects.items[0]);

        const project = await projectsApi.getProjectDetails(projectId);

        logResponse("getProjectDetails", project);

        const targetLocaleIds = project.targetLocales.map((locale) => locale.localeId);

        const job = await jobsApi.createJob(
            projectId,
            new CreateJobParameters()
                .setName(`api-sdk-nodejs estimates integration test ${Date.now()}`)
                .setTargetLocaleIds(targetLocaleIds)
        );

        logResponse("createJob", job);
        ({ translationJobUid } = job);

        // Real translatable content, so the generated reports have non-zero word counts and
        // a populated locale/workflow/fuzzy-match breakdown to verify the nested DTOs against.
        fileUri = `api-sdk-nodejs-estimates-integration-test-${Date.now()}.json`;

        const uploaded = await filesApi.uploadFile(
            projectId,
            new UploadFileParameters()
                .setFileUri(fileUri)
                .setFileType(FileType.JSON)
                .setFileContent(JSON.stringify({
                    greeting: "Hello, welcome to our service!",
                    farewell: "Thank you for using our application, we hope to see you again soon.",
                    description: "This is a sample piece of content used to generate a translation estimate for integration testing purposes."
                }))
        );

        logResponse("uploadFile", uploaded);

        const addedFile = await jobsApi.addFileToJob(
            projectId,
            translationJobUid,
            new AddFileParameters().setFileUri(fileUri).setTargetLocaleIds(targetLocaleIds)
        );

        logResponse("addFileToJob", addedFile);

        // Assigns the project's default workflow per locale, so the estimate has a workflow
        // to break the word counts down by.
        const authorized = await jobsApi.authorizeJob(
            projectId, translationJobUid, new AuthorizeJobParameters()
        );

        logResponse("authorizeJob", authorized);
    });

    after(async () => {
        if (translationJobUid) {
            // A job can only be deleted once it's CANCELLED.
            await jobsApi.cancelJob(
                projectId,
                translationJobUid,
                new CancelJobParameters().setReason("api-sdk-nodejs integration test cleanup")
            );
            await jobsApi.deleteJob(projectId, translationJobUid);
        }

        if (fileUri) {
            await filesApi.deleteFile(projectId, fileUri);
        }
    });

    async function waitForReportCompletion(reportUid: string): Promise<void> {
        for (let attempt = 0; attempt < 30; attempt += 1) {
            /* eslint-disable-next-line no-await-in-loop */
            const status = await estimatesApi.getEstimateReportStatus(projectId, reportUid);

            logResponse("getEstimateReportStatus", status);

            if (TERMINAL_REPORT_STATUSES.includes(status.reportStatus)) {
                return;
            }

            /* eslint-disable-next-line no-await-in-loop */
            await delay(3000);
        }

        throw new Error(`Timed out waiting for report ${reportUid} to complete`);
    }

    it("generates, reads, lists, tags, downloads and deletes a fuzzy estimate report", async () => {
        const generated = await estimatesApi.generateJobFuzzyEstimateReport(
            projectId,
            translationJobUid,
            new GenerateJobEstimateReportParameters().setContentType(JobContentType.ALL_CONTENT)
        );

        logResponse("generateJobFuzzyEstimateReport", generated);
        assert.ok(generated.reportUid);

        const { reportUid } = generated;

        await waitForReportCompletion(reportUid);

        const report = await estimatesApi.getEstimateReport(projectId, reportUid);

        logResponse("getEstimateReport", report);
        assert.equal(report.reportUid, reportUid);
        assert.ok(report.totalStrings > 0, "expected non-zero totalStrings now the job has real content");

        const list = await estimatesApi.getJobFuzzyEstimateReports(
            projectId,
            translationJobUid,
            new ListJobEstimateReportsParameters().setLimit(10).setOffset(0)
        );

        logResponse("getJobFuzzyEstimateReports", list);
        assert.ok(list.items.some((item) => item.reportUid === reportUid));

        const tagged = await estimatesApi.modifyEstimateReportTags(
            projectId,
            reportUid,
            new ModifyEstimateReportTagsParameters().setTags(["api-sdk-nodejs-integration"])
        );

        logResponse("modifyEstimateReportTags", tagged);
        assert.deepEqual(tagged.tags, ["api-sdk-nodejs-integration"]);

        const downloaded = await estimatesApi.downloadEstimateReport(projectId, reportUid);

        logResponse("downloadEstimateReport", `<${downloaded.byteLength} bytes>`);
        assert.ok(downloaded.byteLength > 0);

        await estimatesApi.deleteEstimateReport(projectId, reportUid);
    });

    it("generates and reads a cost estimate report", async () => {
        const generated = await estimatesApi.generateJobCostEstimateReport(
            projectId,
            translationJobUid,
            new GenerateJobEstimateReportParameters().setContentType(JobContentType.ALL_CONTENT)
        );

        logResponse("generateJobCostEstimateReport", generated);
        assert.ok(generated.reportUid);

        const { reportUid } = generated;

        await waitForReportCompletion(reportUid);

        const report = await estimatesApi.getEstimateReport(projectId, reportUid);

        logResponse("getEstimateReport (cost)", report);
        assert.equal(report.reportUid, reportUid);
        assert.ok(report.totalStrings > 0, "expected non-zero totalStrings now the job has real content");

        const list = await estimatesApi.getJobCostEstimateReports(
            projectId,
            translationJobUid,
            new ListJobEstimateReportsParameters().setLimit(10).setOffset(0)
        );

        logResponse("getJobCostEstimateReports", list);
        assert.ok(list.items.some((item) => item.reportUid === reportUid));

        await estimatesApi.deleteEstimateReport(projectId, reportUid);
    });
});
