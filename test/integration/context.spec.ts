import dotenv from "dotenv";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../../api/builder/index";
import { SmartlingBaseApi } from "../../api/base/index";
import { AccessTokenProvider } from "../../api/auth/access-token-provider";
import { ResponseBodyType } from "../../api/base/enum/response-body-type";
import { SmartlingContextApi } from "../../api/context/index";
import { SmartlingProjectsApi } from "../../api/projects/index";
import { SmartlingFilesApi } from "../../api/files/index";
import { SmartlingStringsApi } from "../../api/strings/index";
import { CreateProjectParameters } from "../../api/projects/params/create-project-parameters";
import { UploadFileParameters } from "../../api/files/params/upload-file-parameters";
import { FileType } from "../../api/files/params/file-type";
import { FetchSourceStringsParameters } from "../../api/strings/params/fetch-source-strings-parameters";
import { ContextUploadParameters } from "../../api/context/params/context-upload-parameters";
import { ContextUploadAndMatchParameters } from "../../api/context/params/context-upload-and-match-parameters";
import { ContextAutomaticMatchParameters } from "../../api/context/params/context-automatic-match-parameters";
import { CreateBindingsParameters } from "../../api/context/params/create-bindings-parameters";
import { ListBindingsParameters } from "../../api/context/params/list-bindings-parameters";
import { DeleteBindingsParameters } from "../../api/context/params/delete-bindings-parameters";
import { DeleteContextsAsyncParameters } from "../../api/context/params/delete-contexts-async-parameters";
import { ListParameters } from "../../api/context/params/list-parameters";
import { ContextType } from "../../api/context/params/context-type";
import { ContextProcessState } from "../../api/context/params/context-process-state";
import { HtmlBindingDto } from "../../api/context/dto/binding/html-binding-dto";
import { logResponse } from "./helpers/log-response";

function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

dotenv.config();

const baseSmartlingApiUrl = process.env.SMARTLING_API_BASE_URL || "https://api.smartling.com";
const accountUid = process.env.SMARTLING_ACCOUNT_UID as string;
const userId = process.env.SMARTLING_USER_ID as string;
const userSecret = process.env.SMARTLING_USER_SECRET as string;
const hasCredentials = Boolean(accountUid && userId && userSecret);

describe("SmartlingContextApi integration tests.", function integrationSuite() {
    this.timeout(180000);

    let contextApi: SmartlingContextApi;
    let projectsApi: SmartlingProjectsApi;
    let filesApi: SmartlingFilesApi;
    let stringsApi: SmartlingStringsApi;
    let projectId: string;
    let fileUri: string;
    let stringHashcode: string;
    let contextUid: string;

    const suiteId = Date.now();
    const html = "<html><body><p>Hello world</p></body></html>";

    function buildApi<T extends SmartlingBaseApi>(
        apiClass: new (baseUrl: string, authApi: AccessTokenProvider, logger) => T
    ): T {
        return new SmartlingApiClientBuilder()
            .setBaseSmartlingApiUrl(baseSmartlingApiUrl)
            .authWithUserIdAndUserSecret(userId, userSecret)
            .build(apiClass);
    }

    async function waitForProcess(processUid: string) {
        for (let attempt = 0; attempt < 30; attempt += 1) {
            // eslint-disable-next-line no-await-in-loop
            const result = await contextApi.getProcessResults(projectId, processUid);

            logResponse("getProcessResults", result);
            if (result.processState !== ContextProcessState.IN_PROGRESS) {
                return result;
            }

            // eslint-disable-next-line no-await-in-loop
            await delay(2000);
        }

        throw new Error(`Process ${processUid} did not finish in time`);
    }

    async function uploadHtmlContext(name: string): Promise<string> {
        const uploaded = await contextApi.upload(
            projectId,
            new ContextUploadParameters().setName(name).setContent(html)
        );

        logResponse("upload", uploaded);

        return uploaded.contextUid;
    }

    before(function skipWithoutCredentials() {
        if (!hasCredentials) {
            // eslint-disable-next-line no-console
            console.log("Skipping Context integration tests: set SMARTLING_ACCOUNT_UID, SMARTLING_USER_ID, SMARTLING_USER_SECRET in .env");
            this.skip();
        }

        contextApi = buildApi(SmartlingContextApi);
        projectsApi = buildApi(SmartlingProjectsApi);
        filesApi = buildApi(SmartlingFilesApi);
        stringsApi = buildApi(SmartlingStringsApi);
    });

    before(async () => {
        const existingProjects = await projectsApi.listProjects(accountUid);

        assert.ok(existingProjects.items.length > 0, "Test account must have at least one project to run Context integration tests");

        const sampleProject = await projectsApi.getProjectDetails(
            existingProjects.items[0].projectId,
            true
        );
        const created = await projectsApi.createProject(
            accountUid,
            new CreateProjectParameters()
                .setProjectName(`api-sdk-nodejs context integration test ${suiteId}`)
                .setProjectTypeCode(sampleProject.projectTypeCode)
                .setOriginalLocaleId(sampleProject.sourceLocaleId)
                .setTranslationLocaleIds([sampleProject.targetLocales[0].localeId])
        );

        logResponse("createProject", created);
        ({ projectUid: projectId } = created);

        fileUri = `context-integration-${suiteId}.json`;
        const uploadedFile = await filesApi.uploadFile(
            projectId,
            new UploadFileParameters()
                .setFileUri(fileUri)
                .setFileType(FileType.JSON)
                .setFileContent(JSON.stringify({ greeting: "Hello world" }))
        );

        logResponse("uploadFile", uploadedFile);

        for (let attempt = 0; attempt < 30 && !stringHashcode; attempt += 1) {
            // eslint-disable-next-line no-await-in-loop
            const strings = await stringsApi.getSourceStrings(
                projectId,
                new FetchSourceStringsParameters().setFileUri(fileUri)
            );

            if (strings.items.length > 0) {
                stringHashcode = strings.items[0].hashcode;
            } else {
                // eslint-disable-next-line no-await-in-loop
                await delay(2000);
            }
        }
        assert.ok(stringHashcode, "Uploaded file strings were not available in time");

        contextUid = await uploadHtmlContext(`context-it-${suiteId}`);
    });

    after(async () => {
        if (projectId) {
            await projectsApi.archiveProject(projectId);
        }
    });

    it("lists contexts", async () => {
        const list = await contextApi.listContexts(
            projectId,
            new ListParameters().setType(ContextType.HTML)
        );

        logResponse("listContexts", list);
        assert.ok(list.items.some((context) => context.contextUid === contextUid));
    });

    it("gets context info", async () => {
        const context = await contextApi.getContext(projectId, contextUid);

        logResponse("getContext", context);
        assert.strictEqual(context.contextUid, contextUid);
        assert.strictEqual(context.contextType, ContextType.HTML);
        assert.ok(context.created instanceof Date);
    });

    it("downloads context content", async () => {
        const text = await contextApi.downloadContextContent(
            projectId, contextUid, ResponseBodyType.TEXT
        );
        const buffer = await contextApi.downloadContextContent(projectId, contextUid);

        logResponse("downloadContextContent (text)", text);
        logResponse("downloadContextContent (bytes)", (buffer as ArrayBuffer).byteLength);
        assert.ok((text as string).includes("Hello world"));
        assert.ok((buffer as ArrayBuffer).byteLength > 0);
    });

    it("runs automatic match", async () => {
        const result = await contextApi.runAutomaticMatch(
            projectId,
            contextUid,
            new ContextAutomaticMatchParameters().setStringHashcodes([stringHashcode])
        );

        logResponse("runAutomaticMatch", result);
        assert.ok(result);
    });

    it("creates, lists and deletes bindings", async () => {
        const binding: HtmlBindingDto = {
            contextUid,
            stringHashcode,
            selector: { anchors: ["Hello world"] }
        };

        const created = await contextApi.createStringsToContextBindings(
            projectId,
            new CreateBindingsParameters().addBinding(binding)
        );

        logResponse("createStringsToContextBindings", created);

        const listed = await contextApi.listBindings(
            projectId,
            new ListBindingsParameters().setContextUid(contextUid)
        );

        logResponse("listBindings", listed);
        assert.ok(listed.items.some((item) => item.stringHashcode === stringHashcode));

        const removed = await contextApi.deleteBindings(
            projectId,
            new DeleteBindingsParameters().setContextUid(contextUid)
        );

        logResponse("deleteBindings", removed);
        assert.strictEqual(removed.totalCount, 1);

        const listedAfter = await contextApi.listBindings(
            projectId,
            new ListBindingsParameters().setContextUid(contextUid)
        );

        logResponse("listBindings (after delete)", listedAfter);
        assert.strictEqual(listedAfter.items.length, 0);
    });

    it("uploads context with automatic match and reads results", async () => {
        const started = await contextApi.uploadAndMatchContext(
            projectId,
            new ContextUploadAndMatchParameters()
                .setName(`context-it-match-${suiteId}`)
                .setContent(html)
                .setStringHashcodes([stringHashcode])
        );

        logResponse("uploadAndMatchContext", started);
        assert.ok(started.processUid);

        const process = await waitForProcess(started.processUid);

        assert.strictEqual(process.processState, ContextProcessState.COMPLETED);

        if (started.matchId) {
            const match = await contextApi.getMatchResults(projectId, started.matchId);

            logResponse("getMatchResults", match);
            assert.strictEqual(match.matchId, started.matchId);
        }
    });

    it("deletes a context", async () => {
        const uid = await uploadHtmlContext(`context-it-delete-${suiteId}`);

        const result = await contextApi.delete(projectId, uid);

        logResponse("delete", result);
        const list = await contextApi.listContexts(projectId, new ListParameters());

        assert.ok(!list.items.some((context) => context.contextUid === uid));
    });

    it("deletes contexts asynchronously", async () => {
        const uids = [
            await uploadHtmlContext(`context-it-async-delete-1-${suiteId}`),
            await uploadHtmlContext(`context-it-async-delete-2-${suiteId}`)
        ];

        const started = await contextApi.deleteContextsAsync(
            projectId,
            new DeleteContextsAsyncParameters().setContextUids(uids)
        );

        logResponse("deleteContextsAsync", started);
        const process = await waitForProcess(started.processUid);

        assert.strictEqual(process.processState, ContextProcessState.COMPLETED);
        const list = await contextApi.listContexts(projectId, new ListParameters());

        assert.ok(!list.items.some((context) => uids.includes(context.contextUid)));
    });
});
