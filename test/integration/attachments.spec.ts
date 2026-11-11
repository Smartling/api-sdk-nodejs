import dotenv from "dotenv";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../../api/builder/index";
import { SmartlingBaseApi } from "../../api/base/index";
import { AccessTokenProvider } from "../../api/auth/access-token-provider";
import { SmartlingAttachmentsApi } from "../../api/attachments/index";
import { SmartlingJobsApi } from "../../api/jobs/index";
import { SmartlingProjectsApi } from "../../api/projects/index";
import { AttachmentEntityType } from "../../api/attachments/params/attachment-entity-type";
import { CreateAttachmentParameters } from "../../api/attachments/params/create-attachment-parameters";
import { CreateJobParameters } from "../../api/jobs/params/create-job-parameters";
import { CancelJobParameters } from "../../api/jobs/params/cancel-job-parameters";
import { logResponse } from "./helpers/log-response";

dotenv.config();

const baseSmartlingApiUrl = process.env.SMARTLING_API_BASE_URL || "https://api.smartling.com";
const accountUid = process.env.SMARTLING_ACCOUNT_UID as string;
const userId = process.env.SMARTLING_USER_ID as string;
const userSecret = process.env.SMARTLING_USER_SECRET as string;
const hasCredentials = Boolean(accountUid && userId && userSecret);

describe("SmartlingAttachmentsApi integration tests.", function integrationSuite() {
    this.timeout(180000);

    let attachmentsApi: SmartlingAttachmentsApi;
    let jobsApi: SmartlingJobsApi;
    let projectsApi: SmartlingProjectsApi;
    let projectId: string;
    let jobUid: string;
    let attachmentUid: string;

    const suiteId = Date.now();
    const fileContent = `api-sdk-nodejs attachments integration test ${suiteId}`;
    const attachmentName = `attachments-integration-${suiteId}.txt`;

    function buildApi<T extends SmartlingBaseApi>(
        apiClass: new (baseUrl: string, authApi: AccessTokenProvider, logger) => T
    ): T {
        return new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret)
            .build(apiClass);
    }

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping Attachments integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET in .env");
            this.skip();
        }

        attachmentsApi = buildApi(SmartlingAttachmentsApi);
        jobsApi = buildApi(SmartlingJobsApi);
        projectsApi = buildApi(SmartlingProjectsApi);
    });

    before(async () => {
        const projects = await projectsApi.listProjects(accountUid);

        logResponse("listProjects", projects);
        assert.ok(projects.items.length > 0, "Test account must have at least one project to run Attachments integration tests");

        ({ projectId } = projects.items[0]);

        const project = await projectsApi.getProjectDetails(projectId);

        logResponse("getProjectDetails", project);

        const job = await jobsApi.createJob(
            projectId,
            new CreateJobParameters()
                .setName(`api-sdk-nodejs attachments integration test ${suiteId}`)
                .setTargetLocaleIds(project.targetLocales.map((locale) => locale.localeId))
        );

        logResponse("createJob", job);
        ({ translationJobUid: jobUid } = job);
    });

    // The attachments API has no delete endpoint: the service removes attachments that have no
    // links on an hourly schedule. Cleanup is therefore deleting the job the attachments were
    // linked to (a job can only be deleted once it is CANCELLED).
    after(async () => {
        if (jobUid) {
            await jobsApi.cancelJob(
                projectId,
                jobUid,
                new CancelJobParameters().setReason("api-sdk-nodejs integration test cleanup")
            );
            await jobsApi.deleteJob(projectId, jobUid);
        }
    });

    it("uploads an attachment from a buffer and links it to a job", async () => {
        const attachment = await attachmentsApi.createAttachment(
            accountUid,
            AttachmentEntityType.JOBS,
            new CreateAttachmentParameters()
                .setName(attachmentName)
                .setDescription("integration test attachment")
                .setEntityUids([jobUid])
                .setFileContentFromBuffer(Buffer.from(fileContent))
        );

        logResponse("createAttachment", attachment);
        ({ attachmentUid } = attachment);

        assert.ok(attachmentUid);
        assert.strictEqual(attachment.name, attachmentName);
        assert.strictEqual(attachment.description, "integration test attachment");
        assert.ok(attachment.createdDate instanceof Date);
        assert.strictEqual(typeof attachment.createdByUserUid, "string");
    });

    it("uploads an attachment from a local file path", async () => {
        const attachment = await attachmentsApi.createAttachment(
            accountUid,
            AttachmentEntityType.JOBS,
            new CreateAttachmentParameters()
                .setName(`from-path-${attachmentName}`)
                .setEntityUids([jobUid])
                .setFileFromLocalFilePath("./test/data/sample-attachment.txt")
        );

        logResponse("createAttachment (local file path)", attachment);

        assert.ok(attachment.attachmentUid);
        assert.strictEqual(attachment.name, `from-path-${attachmentName}`);
    });

    it("lists the attachments linked to a job", async () => {
        const result = await attachmentsApi.listEntityAttachments(
            accountUid,
            AttachmentEntityType.JOBS,
            jobUid
        );

        logResponse("listEntityAttachments", result);

        assert.strictEqual(result.totalCount, 2);

        const linked = result.items.find((item) => item.attachmentUid === attachmentUid);

        assert.ok(linked, "uploaded attachment must be linked to the job");
        assert.strictEqual(linked.name, attachmentName);
        assert.ok(linked.createdDate instanceof Date);
        assert.strictEqual(typeof linked.canDelete, "boolean");
    });

    it("downloads an attachment as an ArrayBuffer", async () => {
        const content = await attachmentsApi.downloadAttachment(
            accountUid,
            AttachmentEntityType.JOBS,
            attachmentUid
        );

        logResponse("downloadAttachment", { byteLength: content.byteLength });

        assert.strictEqual(Buffer.from(content).toString(), fileContent);
    });

    it("downloads an attachment with metadata", async () => {
        const download = await attachmentsApi.downloadAttachmentWithMetadata(
            accountUid,
            AttachmentEntityType.JOBS,
            attachmentUid,
            { maxBytes: 1024 * 1024 }
        );

        logResponse("downloadAttachmentWithMetadata", {
            fileName: download.fileName,
            contentType: download.contentType,
            byteLength: download.fileContent.byteLength
        });

        assert.strictEqual(Buffer.from(download.fileContent).toString(), fileContent);
        assert.strictEqual(download.fileName, attachmentName);
    });

    it("rejects a download larger than maxBytes", async () => {
        await assert.rejects(
            attachmentsApi.downloadAttachmentWithMetadata(
                accountUid,
                AttachmentEntityType.JOBS,
                attachmentUid,
                { maxBytes: 1 }
            ),
            /exceeds the maximum allowed/
        );
    });
});
