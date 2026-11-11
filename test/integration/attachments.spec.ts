import dotenv from "dotenv";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../../api/builder/index";
import { SmartlingBaseApi } from "../../api/base/index";
import { AccessTokenProvider } from "../../api/auth/access-token-provider";
import { SmartlingAttachmentsApi } from "../../api/attachments/index";
import { SmartlingJobsApi } from "../../api/jobs/index";
import { SmartlingProjectsApi } from "../../api/projects/index";
import { SmartlingGlossariesApi } from "../../api/glossaries/index";
import { SmartlingFilesApi } from "../../api/files/index";
import { SmartlingStringsApi } from "../../api/strings/index";
import { SmartlingIssuesApi } from "../../api/issues/index";
import { SmartlingException } from "../../api/exception/index";
import { AttachmentEntityType } from "../../api/attachments/params/attachment-entity-type";
import { CreateAttachmentParameters } from "../../api/attachments/params/create-attachment-parameters";
import { CreateJobParameters } from "../../api/jobs/params/create-job-parameters";
import { CancelJobParameters } from "../../api/jobs/params/cancel-job-parameters";
import { CreateGlossaryParameters } from "../../api/glossaries/params/create-glossary-parameters";
import { CreateGlossaryEntryParameters } from "../../api/glossaries/params/create-glossary-entry-parameters";
import { ArchiveGlossariesParameters } from "../../api/glossaries/params/archive-glossaries-parameters";
import { UploadFileParameters } from "../../api/files/params/upload-file-parameters";
import { FileType } from "../../api/files/params/file-type";
import { FetchSourceStringsParameters } from "../../api/strings/params/fetch-source-strings-parameters";
import { CreateIssueParameters } from "../../api/issues/params/create-issue-parameters";
import { UpdateIssueStateParameters } from "../../api/issues/params/update-issue-state-parameters";
import { CreateIssueStringDto } from "../../api/issues/dto/create-issue-string-dto";
import { IssueType } from "../../api/issues/enums/issue-type";
import { IssueSubType } from "../../api/issues/enums/issue-sub-type";
import { IssueState } from "../../api/issues/enums/issue-state";
import { logResponse } from "./helpers/log-response";

dotenv.config();

const baseSmartlingApiUrl = process.env.SMARTLING_API_BASE_URL || "https://api.smartling.com";
const accountUid = process.env.SMARTLING_ACCOUNT_UID as string;
const userId = process.env.SMARTLING_USER_ID as string;
const userSecret = process.env.SMARTLING_USER_SECRET as string;
const hasCredentials = Boolean(accountUid && userId && userSecret);

// The file's strings are indexed asynchronously, so poll until a hashcode is readable.
async function waitForFirstHashcode(
    stringsApi: SmartlingStringsApi,
    projectId: string,
    fileUri: string
): Promise<string> {
    for (let attempt = 0; attempt < 15; attempt += 1) {
        // eslint-disable-next-line no-await-in-loop
        const sourceStrings = await stringsApi.getSourceStrings(
            projectId,
            new FetchSourceStringsParameters().setFileUri(fileUri)
        );

        if (sourceStrings.items.length > 0) {
            logResponse("getSourceStrings", sourceStrings);

            return sourceStrings.items[0].hashcode;
        }

        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => { setTimeout(resolve, 2000); });
    }

    throw new Error(`No source strings became readable for ${fileUri}`);
}

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

describe("SmartlingAttachmentsApi glossary integration tests.", function integrationSuite() {
    this.timeout(60000);

    let attachmentsApi: SmartlingAttachmentsApi;
    let glossariesApi: SmartlingGlossariesApi;
    let glossaryUid: string;
    let entryUid: string;
    let attachmentUid: string;

    const suiteId = Date.now();
    const fileContent = `api-sdk-nodejs glossary attachment integration test ${suiteId}`;
    const attachmentName = `glossary-attachment-${suiteId}.txt`;

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping Attachments glossary integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET in .env");
            this.skip();
        }

        const builder = () => new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret);

        attachmentsApi = builder().build(SmartlingAttachmentsApi);
        glossariesApi = builder().build(SmartlingGlossariesApi);
    });

    before(async () => {
        const glossary = await glossariesApi.createGlossary(
            accountUid,
            new CreateGlossaryParameters()
                .setGlossaryName(`Attachments integration test glossary ${suiteId}`)
                .setLocaleIds(["en-US", "fr-FR"])
        );

        logResponse("createGlossary", glossary);
        ({ glossaryUid } = glossary);

        const entry = await glossariesApi.createGlossaryEntry(
            accountUid,
            glossaryUid,
            new CreateGlossaryEntryParameters()
                .setDefinition("Attachments integration test term")
                .setTranslations([{ localeId: "fr-FR", term: "Terme de test" }])
        );

        logResponse("createGlossaryEntry", entry);
        ({ entryUid } = entry);
    });

    // Glossary attachments are linked to an entry UID. The attachments API has no delete
    // endpoint, so cleanup is archiving the glossary; the service removes the orphaned file later.
    after(async () => {
        if (glossaryUid) {
            await glossariesApi.archiveGlossaries(
                accountUid,
                new ArchiveGlossariesParameters().setGlossaryUids([glossaryUid])
            );
        }
    });

    it("uploads an attachment and links it to a glossary entry", async () => {
        const attachment = await attachmentsApi.createAttachment(
            accountUid,
            AttachmentEntityType.GLOSSARIES,
            new CreateAttachmentParameters()
                .setName(attachmentName)
                .setDescription("glossary integration test attachment")
                .setEntityUids([entryUid])
                .setFileContentFromBuffer(Buffer.from(fileContent))
        );

        logResponse("createAttachment (glossaries)", attachment);
        ({ attachmentUid } = attachment);

        assert.ok(attachmentUid);
        assert.strictEqual(attachment.name, attachmentName);
        assert.ok(attachment.createdDate instanceof Date);
    });

    it("lists the attachment linked to the glossary entry", async () => {
        const result = await attachmentsApi.listEntityAttachments(
            accountUid,
            AttachmentEntityType.GLOSSARIES,
            entryUid
        );

        logResponse("listEntityAttachments (glossaries)", result);

        assert.strictEqual(result.totalCount, 1);
        assert.strictEqual(result.items[0].attachmentUid, attachmentUid);
        assert.strictEqual(result.items[0].name, attachmentName);
        assert.strictEqual(typeof result.items[0].canDelete, "boolean");
    });

    it("downloads the glossary attachment", async () => {
        const download = await attachmentsApi.downloadAttachmentWithMetadata(
            accountUid,
            AttachmentEntityType.GLOSSARIES,
            attachmentUid,
            { maxBytes: 1024 * 1024 }
        );

        logResponse("downloadAttachmentWithMetadata (glossaries)", {
            fileName: download.fileName,
            contentType: download.contentType,
            byteLength: download.fileContent.byteLength
        });

        assert.strictEqual(Buffer.from(download.fileContent).toString(), fileContent);
        assert.strictEqual(download.fileName, attachmentName);
    });

    it("rejects a second attachment on the same entry, as glossaries allow only one", async () => {
        await assert.rejects(
            attachmentsApi.createAttachment(
                accountUid,
                AttachmentEntityType.GLOSSARIES,
                new CreateAttachmentParameters()
                    .setName(`second-${attachmentName}`)
                    .setEntityUids([entryUid])
                    .setFileContentFromBuffer(Buffer.from("second"))
            ),
            (error: unknown) => {
                logResponse("createAttachment (glossaries, over the cap)", error);

                return error instanceof SmartlingException;
            }
        );
    });
});

describe("SmartlingAttachmentsApi string integration tests.", function integrationSuite() {
    this.timeout(120000);

    let attachmentsApi: SmartlingAttachmentsApi;
    let projectsApi: SmartlingProjectsApi;
    let filesApi: SmartlingFilesApi;
    let stringsApi: SmartlingStringsApi;
    let projectId: string;
    let fileUri: string;
    let stringEntityUid: string;
    let attachmentUid: string;

    const suiteId = Date.now();
    const fileContent = `api-sdk-nodejs string attachment integration test ${suiteId}`;
    const attachmentName = `string-attachment-${suiteId}.txt`;

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping Attachments string integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET in .env");
            this.skip();
        }

        const builder = () => new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret);

        attachmentsApi = builder().build(SmartlingAttachmentsApi);
        projectsApi = builder().build(SmartlingProjectsApi);
        filesApi = builder().build(SmartlingFilesApi);
        stringsApi = builder().build(SmartlingStringsApi);
    });

    before(async () => {
        const projects = await projectsApi.listProjects(accountUid);

        logResponse("listProjects", projects);
        assert.ok(projects.items.length > 0, "Test account must have at least one project to run Attachments string integration tests");

        ({ projectId } = projects.items[0]);

        const uploadFileUri = `api-sdk-nodejs-attachments-integration-test-${suiteId}.json`;

        const uploaded = await filesApi.uploadFile(
            projectId,
            new UploadFileParameters()
                .setFileUri(uploadFileUri)
                .setFileType(FileType.JSON)
                .setFileContent(JSON.stringify({
                    greeting: `Hello from the attachments integration test ${suiteId}`
                }))
        );

        logResponse("uploadFile", uploaded);

        // Only remember the file for cleanup once it exists, so a failed upload does not make
        // the cleanup hook throw a second, misleading error.
        fileUri = uploadFileUri;

        // The attachment entity UID for a string is "<projectUid>:<hashcode>".
        stringEntityUid = `${projectId}:${await waitForFirstHashcode(stringsApi, projectId, fileUri)}`;

        assert.ok(stringEntityUid, "uploaded file must expose at least one source string");
    });

    // The attachments API has no delete endpoint; the service removes the orphaned attachment on
    // an hourly schedule. Cleanup is deleting the file the string came from.
    after(async () => {
        if (fileUri) {
            await filesApi.deleteFile(projectId, fileUri);
        }
    });

    it("uploads an attachment and links it to a string", async () => {
        const attachment = await attachmentsApi.createAttachment(
            accountUid,
            AttachmentEntityType.STRINGS,
            new CreateAttachmentParameters()
                .setName(attachmentName)
                .setDescription("string integration test attachment")
                .setEntityUids([stringEntityUid])
                .setFileContentFromBuffer(Buffer.from(fileContent))
        );

        logResponse("createAttachment (strings)", attachment);
        ({ attachmentUid } = attachment);

        assert.ok(attachmentUid);
        assert.strictEqual(attachment.name, attachmentName);
        assert.ok(attachment.createdDate instanceof Date);
    });

    it("lists the attachment linked to the string", async () => {
        const result = await attachmentsApi.listEntityAttachments(
            accountUid,
            AttachmentEntityType.STRINGS,
            stringEntityUid
        );

        logResponse("listEntityAttachments (strings)", result);

        assert.strictEqual(result.totalCount, 1);
        assert.strictEqual(result.items[0].attachmentUid, attachmentUid);
        assert.strictEqual(result.items[0].name, attachmentName);
        assert.strictEqual(typeof result.items[0].canDelete, "boolean");
    });

    it("downloads the string attachment", async () => {
        const download = await attachmentsApi.downloadAttachmentWithMetadata(
            accountUid,
            AttachmentEntityType.STRINGS,
            attachmentUid,
            { maxBytes: 1024 * 1024 }
        );

        logResponse("downloadAttachmentWithMetadata (strings)", {
            fileName: download.fileName,
            contentType: download.contentType,
            byteLength: download.fileContent.byteLength
        });

        assert.strictEqual(Buffer.from(download.fileContent).toString(), fileContent);
        assert.strictEqual(download.fileName, attachmentName);
    });

    it("rejects a second attachment on the same string, as strings allow only one", async () => {
        await assert.rejects(
            attachmentsApi.createAttachment(
                accountUid,
                AttachmentEntityType.STRINGS,
                new CreateAttachmentParameters()
                    .setName(`second-${attachmentName}`)
                    .setEntityUids([stringEntityUid])
                    .setFileContentFromBuffer(Buffer.from("second"))
            ),
            (error: unknown) => {
                logResponse("createAttachment (strings, over the cap)", error);

                return error instanceof SmartlingException;
            }
        );
    });
});

describe("SmartlingAttachmentsApi issue integration tests.", function integrationSuite() {
    this.timeout(120000);

    let attachmentsApi: SmartlingAttachmentsApi;
    let projectsApi: SmartlingProjectsApi;
    let filesApi: SmartlingFilesApi;
    let stringsApi: SmartlingStringsApi;
    let issuesApi: SmartlingIssuesApi;
    let projectId: string;
    let fileUri: string;
    let issueUid: string;
    let issueEntityUid: string;
    let attachmentUid: string;

    const suiteId = Date.now();
    const fileContent = `api-sdk-nodejs issue attachment integration test ${suiteId}`;
    const attachmentName = `issue-attachment-${suiteId}.txt`;

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping Attachments issue integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET in .env");
            this.skip();
        }

        const builder = () => new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret);

        attachmentsApi = builder().build(SmartlingAttachmentsApi);
        projectsApi = builder().build(SmartlingProjectsApi);
        filesApi = builder().build(SmartlingFilesApi);
        stringsApi = builder().build(SmartlingStringsApi);
        issuesApi = builder().build(SmartlingIssuesApi);
    });

    before(async () => {
        const projects = await projectsApi.listProjects(accountUid);

        logResponse("listProjects", projects);
        assert.ok(projects.items.length > 0, "Test account must have at least one project to run Attachments issue integration tests");

        ({ projectId } = projects.items[0]);

        const uploadFileUri = `api-sdk-nodejs-attachments-issue-integration-test-${suiteId}.json`;

        await filesApi.uploadFile(
            projectId,
            new UploadFileParameters()
                .setFileUri(uploadFileUri)
                .setFileType(FileType.JSON)
                .setFileContent(JSON.stringify({
                    greeting: `Hello from the attachments issue integration test ${suiteId}`
                }))
        );

        // Only remember the file for cleanup once it exists, so a failed upload does not make
        // the cleanup hook throw a second, misleading error.
        fileUri = uploadFileUri;

        const hashcode = await waitForFirstHashcode(stringsApi, projectId, fileUri);

        const issue = await issuesApi.createIssue(
            projectId,
            new CreateIssueParameters()
                .setIssueText(`api-sdk-nodejs attachments integration test ${suiteId}`)
                .setIssueType(IssueType.SOURCE)
                .setIssueSubType(IssueSubType.CLARIFICATION)
                // A source issue must not carry a locale; the DTO types localeId as required.
                .setString({ hashcode } as CreateIssueStringDto)
        );

        logResponse("createIssue", issue);
        ({ issueUid } = issue);

        // Per the public API reference, an issue attachment's entity UID is
        // "<accountUid>-<issueUid>". The service does not check that the entity exists, so this
        // proves the API's behaviour, not that the dashboard shows the link.
        issueEntityUid = `${accountUid}-${issueUid}`;
    });

    // The attachments API has no delete endpoint and issues cannot be deleted. Cleanup resolves
    // the issue and deletes the file its string came from; the service removes the orphaned
    // attachment later.
    after(async () => {
        try {
            if (issueUid) {
                await issuesApi.openOrCloseIssue(
                    projectId,
                    issueUid,
                    new UpdateIssueStateParameters().setIssueState(IssueState.RESOLVED)
                );
            }
        } finally {
            // The file is deleted even when resolving the issue failed, so it is not leaked.
            if (fileUri) {
                await filesApi.deleteFile(projectId, fileUri);
            }
        }
    });

    it("uploads an attachment and links it to an issue", async () => {
        const attachment = await attachmentsApi.createAttachment(
            accountUid,
            AttachmentEntityType.ISSUES,
            new CreateAttachmentParameters()
                .setName(attachmentName)
                .setDescription("issue integration test attachment")
                .setEntityUids([issueEntityUid])
                .setFileContentFromBuffer(Buffer.from(fileContent))
        );

        logResponse("createAttachment (issues)", attachment);
        ({ attachmentUid } = attachment);

        assert.ok(attachmentUid);
        assert.strictEqual(attachment.name, attachmentName);
        assert.ok(attachment.createdDate instanceof Date);
    });

    it("lists the attachment linked to the issue", async () => {
        const result = await attachmentsApi.listEntityAttachments(
            accountUid,
            AttachmentEntityType.ISSUES,
            issueEntityUid
        );

        logResponse("listEntityAttachments (issues)", result);

        assert.strictEqual(result.totalCount, 1);
        assert.strictEqual(result.items[0].attachmentUid, attachmentUid);
        assert.strictEqual(result.items[0].name, attachmentName);
        assert.strictEqual(typeof result.items[0].canDelete, "boolean");
    });

    it("downloads the issue attachment", async () => {
        const download = await attachmentsApi.downloadAttachmentWithMetadata(
            accountUid,
            AttachmentEntityType.ISSUES,
            attachmentUid,
            { maxBytes: 1024 * 1024 }
        );

        logResponse("downloadAttachmentWithMetadata (issues)", {
            fileName: download.fileName,
            contentType: download.contentType,
            byteLength: download.fileContent.byteLength
        });

        assert.strictEqual(Buffer.from(download.fileContent).toString(), fileContent);
        assert.strictEqual(download.fileName, attachmentName);
    });

    it("rejects a second attachment on the same issue, as issues allow only one", async () => {
        await assert.rejects(
            attachmentsApi.createAttachment(
                accountUid,
                AttachmentEntityType.ISSUES,
                new CreateAttachmentParameters()
                    .setName(`second-${attachmentName}`)
                    .setEntityUids([issueEntityUid])
                    .setFileContentFromBuffer(Buffer.from("second"))
            ),
            (error: unknown) => {
                logResponse("createAttachment (issues, over the cap)", error);

                return error instanceof SmartlingException;
            }
        );
    });
});
