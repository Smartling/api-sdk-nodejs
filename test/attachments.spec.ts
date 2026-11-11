import "mocha";
import assert from "assert";
import sinon from "sinon";
import FormData from "form-data";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingAttachmentsApi } from "../api/attachments/index";
import { SmartlingAuthApi } from "../api/auth/index";
import { SmartlingException } from "../api/exception/index";
import { AttachmentEntityType } from "../api/attachments/params/attachment-entity-type";
import { CreateAttachmentParameters } from "../api/attachments/params/create-attachment-parameters";

describe("SmartlingAttachmentsApi class tests.", () => {
    let attachmentsApi: SmartlingAttachmentsApi;
    let attachmentsApiFetchStub;
    let attachmentsApiUaStub;
    let responseMockTextStub;

    beforeEach(() => {
        attachmentsApi = new SmartlingAttachmentsApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);
        attachmentsApiFetchStub = sinon.stub(attachmentsApi, "fetch");
        attachmentsApiUaStub = sinon.stub(attachmentsApi, "ua");
        responseMockTextStub = sinon.stub(responseMock, "text");

        attachmentsApiUaStub.returns("test_user_agent");
        attachmentsApiFetchStub.returns(responseMock);
        responseMockTextStub.returns("{\"response\": {}}");
    });

    afterEach(() => {
        attachmentsApiFetchStub.restore();
        responseMockTextStub.restore();
        attachmentsApiUaStub.restore();
    });

    describe("listEntityAttachments", () => {
        it("Should list attachments linked to an entity", async () => {
            await attachmentsApi.listEntityAttachments("accountUid", AttachmentEntityType.JOBS, "entityUid");

            sinon.assert.calledOnce(attachmentsApiFetchStub);
            sinon.assert.calledWithExactly(
                attachmentsApiFetchStub,
                "https://test.com/attachments-api/v2/accounts/accountUid/jobs/entityUid",
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });

        it("Should convert createdDate to Date and keep canDelete", async () => {
            responseMockTextStub.returns(JSON.stringify({
                response: {
                    code: "SUCCESS",
                    data: {
                        totalCount: 1,
                        items: [{
                            attachmentUid: "a1",
                            name: "file.txt",
                            description: "d",
                            createdDate: "2018-03-30T13:14:23Z",
                            createdByUserUid: "u1",
                            canDelete: true
                        }]
                    }
                }
            }));

            const result = await attachmentsApi.listEntityAttachments("accountUid", AttachmentEntityType.ISSUES, "entityUid");

            assert.strictEqual(result.totalCount, 1);
            assert.ok(result.items[0].createdDate instanceof Date);
            assert.strictEqual(result.items[0].canDelete, true);
        });
    });

    describe("createAttachment", () => {
        function getRawBody(): string {
            const body = attachmentsApiFetchStub.getCall(0).args[1].body as FormData;

            return body.getBuffer().toString();
        }

        it("Should upload an attachment from a buffer and link it to entities", async () => {
            const params = new CreateAttachmentParameters()
                .setName("report.txt")
                .setDescription("quarterly report")
                .setEntityUids(["entity-1", "entity-2"])
                .setFileContentFromBuffer(Buffer.from("test file content"));

            await attachmentsApi.createAttachment("accountUid", AttachmentEntityType.JOBS, params);

            sinon.assert.calledOnce(attachmentsApiFetchStub);

            const fetchCall = attachmentsApiFetchStub.getCall(0);

            assert.equal(fetchCall.args[0], "https://test.com/attachments-api/v2/accounts/accountUid/jobs/attachments");
            assert.equal(fetchCall.args[1].method, "post");
            assert.equal(fetchCall.args[1].headers.Authorization, "test_token_type test_access_token");
            assert.equal(fetchCall.args[1].headers["User-Agent"], "test_user_agent");

            const body = fetchCall.args[1].body as FormData;

            assert.equal(fetchCall.args[1].headers["Content-Type"], `multipart/form-data; boundary=${body.getBoundary()}`);

            const rawBody = getRawBody();

            assert.ok(rawBody.includes("name=\"name\""));
            assert.ok(rawBody.includes("report.txt"));
            assert.ok(rawBody.includes("name=\"description\""));
            assert.ok(rawBody.includes("quarterly report"));
            assert.strictEqual(rawBody.match(/name="entityUids"/g)?.length, 2);
            assert.ok(rawBody.includes("entity-1"));
            assert.ok(rawBody.includes("entity-2"));
            assert.ok(rawBody.includes("name=\"file\"; filename=\"report.txt\""));
            assert.ok(rawBody.includes("test file content"));
            assert.ok(!rawBody.includes("name=\"localeId\""));
        });

        it("Should use an explicit file name for the file part", async () => {
            const params = new CreateAttachmentParameters()
                .setName("display name")
                .setFileName("stored.png")
                .setFileContentFromBuffer(Buffer.from("png"));

            await attachmentsApi.createAttachment("accountUid", AttachmentEntityType.STRINGS, params);

            assert.ok(getRawBody().includes("filename=\"stored.png\""));
        });

        it("Should upload an attachment from a local file path, defaulting filename to the basename", async () => {
            const params = new CreateAttachmentParameters()
                .setName("display name")
                .setFileFromLocalFilePath("./test/data/sample-attachment.txt");

            await attachmentsApi.createAttachment("accountUid", AttachmentEntityType.GLOSSARIES, params);

            sinon.assert.calledOnce(attachmentsApiFetchStub);

            const { body } = attachmentsApiFetchStub.getCall(0).args[1];
            // eslint-disable-next-line no-underscore-dangle
            const streams = body._streams as Array<unknown>;
            const fileHeader = streams
                .map((stream) => (Buffer.isBuffer(stream) || typeof stream === "string" ? stream.toString() : ""))
                .find((chunk) => chunk.includes("name=\"file\""));

            assert.ok(fileHeader && fileHeader.includes("filename=\"sample-attachment.txt\""));
        });

        it("Should send localeId when set", async () => {
            const params = new CreateAttachmentParameters()
                .setName("file.txt")
                .setLocaleId("fr-FR")
                .setFileContentFromBuffer(Buffer.from("x"));

            await attachmentsApi.createAttachment("accountUid", AttachmentEntityType.JOBS, params);

            const rawBody = getRawBody();

            assert.ok(rawBody.includes("name=\"localeId\""));
            assert.ok(rawBody.includes("fr-FR"));
        });

        it("Should throw when the name is missing", async () => {
            const params = new CreateAttachmentParameters().setFileContentFromBuffer(Buffer.from("x"));

            try {
                await attachmentsApi.createAttachment("accountUid", AttachmentEntityType.JOBS, params);
                assert.fail("must throw SmartlingException");
            } catch (e) {
                assert.ok(e instanceof SmartlingException);
            }

            sinon.assert.notCalled(attachmentsApiFetchStub);
        });

        it("Should throw when the file is missing", async () => {
            const params = new CreateAttachmentParameters().setName("file.txt");

            try {
                await attachmentsApi.createAttachment("accountUid", AttachmentEntityType.JOBS, params);
                assert.fail("must throw SmartlingException");
            } catch (e) {
                assert.ok(e instanceof SmartlingException);
            }

            sinon.assert.notCalled(attachmentsApiFetchStub);
        });
    });

    describe("downloadAttachment", () => {
        const downloadUrl = "https://test.com/attachments-api/v2/accounts/accountUid/jobs/attachments/attachmentUid";
        const downloadRequest = {
            headers: {
                Authorization: "test_token_type test_access_token",
                "Content-Type": "application/json",
                "User-Agent": "test_user_agent"
            },
            method: "get"
        };

        function stubDownloadResponse(
            headers: Record<string, string>,
            body?: AsyncIterable<Uint8Array>
        ) {
            const arrayBuffer = sinon.stub().resolves(new ArrayBuffer(1));

            attachmentsApiFetchStub.returns({
                status: 200,
                text: async (): Promise<string> => "",
                arrayBuffer,
                body,
                headers: { get: (name: string): string | null => headers[name] ?? null }
            });

            return arrayBuffer;
        }

        it("Should download an attachment as an ArrayBuffer", async () => {
            attachmentsApiFetchStub.returns(responseMock);

            const result = await attachmentsApi.downloadAttachment("accountUid", AttachmentEntityType.JOBS, "attachmentUid");

            sinon.assert.calledOnce(attachmentsApiFetchStub);
            sinon.assert.calledWithExactly(attachmentsApiFetchStub, downloadUrl, downloadRequest);
            assert.ok(result instanceof ArrayBuffer);
        });

        it("Should download an attachment with metadata", async () => {
            stubDownloadResponse({
                "content-type": "image/png",
                "content-disposition": "attachment; filename=\"logo.png\""
            });

            const result = await attachmentsApi.downloadAttachmentWithMetadata(
                "accountUid", AttachmentEntityType.JOBS, "attachmentUid"
            );

            sinon.assert.calledOnce(attachmentsApiFetchStub);
            sinon.assert.calledWithExactly(attachmentsApiFetchStub, downloadUrl, downloadRequest);
            assert.ok(result.fileContent instanceof ArrayBuffer);
            assert.strictEqual(result.contentType, "image/png");
            assert.strictEqual(result.fileName, "logo.png");
        });

        it("Should download an attachment with metadata when no headers are present", async () => {
            stubDownloadResponse({});

            const result = await attachmentsApi.downloadAttachmentWithMetadata(
                "accountUid", AttachmentEntityType.JOBS, "attachmentUid"
            );

            assert.ok(result.fileContent instanceof ArrayBuffer);
            assert.strictEqual(result.contentType, undefined);
            assert.strictEqual(result.fileName, undefined);
        });

        it("Should reject a download whose Content-Length exceeds maxBytes without reading the body", async () => {
            const arrayBufferStub = stubDownloadResponse({ "content-length": "2048" });

            try {
                await attachmentsApi.downloadAttachmentWithMetadata(
                    "accountUid", AttachmentEntityType.JOBS, "attachmentUid", { maxBytes: 1024 }
                );
                assert.fail("must throw SmartlingException");
            } catch (e) {
                assert.ok(e instanceof SmartlingException);
            }

            sinon.assert.notCalled(arrayBufferStub);
        });

        it("Should reject an over-limit download that has no Content-Length when the body is not streamable", async () => {
            const arrayBufferStub = stubDownloadResponse({});

            arrayBufferStub.resolves(new ArrayBuffer(2048));

            try {
                await attachmentsApi.downloadAttachmentWithMetadata(
                    "accountUid", AttachmentEntityType.JOBS, "attachmentUid", { maxBytes: 1024 }
                );
                assert.fail("must throw SmartlingException");
            } catch (e) {
                assert.ok(e instanceof SmartlingException);
            }
        });

        it("Should abort reading a streamed body as soon as it grows past maxBytes", async () => {
            let chunksRead = 0;

            async function* chunks(): AsyncGenerator<Uint8Array> {
                while (chunksRead < 100) {
                    chunksRead += 1;
                    yield new Uint8Array(10);
                }
            }

            const arrayBufferStub = stubDownloadResponse({}, chunks());

            try {
                await attachmentsApi.downloadAttachmentWithMetadata(
                    "accountUid", AttachmentEntityType.JOBS, "attachmentUid", { maxBytes: 25 }
                );
                assert.fail("must throw SmartlingException");
            } catch (e) {
                assert.ok(e instanceof SmartlingException);
            }

            assert.strictEqual(chunksRead, 3, "must stop after the chunk that crosses the limit");
            sinon.assert.notCalled(arrayBufferStub);
        });

        it("Should return a streamed body within maxBytes together with its metadata", async () => {
            async function* chunks(): AsyncGenerator<Uint8Array> {
                yield Buffer.from("hello ");
                yield Buffer.from("world");
            }

            stubDownloadResponse({
                "content-type": "text/plain",
                "content-disposition": "attachment; filename=\"greeting.txt\""
            }, chunks());

            const result = await attachmentsApi.downloadAttachmentWithMetadata(
                "accountUid", AttachmentEntityType.JOBS, "attachmentUid", { maxBytes: 11 }
            );

            assert.strictEqual(Buffer.from(result.fileContent).toString(), "hello world");
            assert.strictEqual(result.contentType, "text/plain");
            assert.strictEqual(result.fileName, "greeting.txt");
        });

        it("Should accept a download whose Content-Length is within maxBytes", async () => {
            stubDownloadResponse({ "content-length": "1024" });

            const result = await attachmentsApi.downloadAttachmentWithMetadata(
                "accountUid", AttachmentEntityType.JOBS, "attachmentUid", { maxBytes: 1024 }
            );

            assert.ok(result.fileContent instanceof ArrayBuffer);
        });
    });
});
