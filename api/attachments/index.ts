import * as fs from "fs";
import * as path from "path";
import FormData from "form-data";
import { SmartlingBaseApi } from "../base/index";
import { SmartlingBaseFileApi } from "../base/base-file-api";
import { ResponseBodyType } from "../base/enum/response-body-type";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { SmartlingException } from "../exception/index";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { fixContentTypeHeaderCase } from "../http/form-data-utils";
import { TranslatedFileDto } from "../dto/translated-file-dto";
import { Logger } from "../logger";
import { AttachmentEntityType } from "./params/attachment-entity-type";
import { CreateAttachmentParameters } from "./params/create-attachment-parameters";
import { DownloadAttachmentOptions } from "./params/download-attachment-options";
import { EntityAttachmentDto } from "./dto/entity-attachment-dto";
import { LinkedEntityAttachmentDto } from "./dto/linked-entity-attachment-dto";

export class SmartlingAttachmentsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);

        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/attachments-api/v2`;
    }

    async listEntityAttachments(
        accountUid: string,
        type: AttachmentEntityType,
        entityUid: string
    ): Promise<SmartlingListResponse<LinkedEntityAttachmentDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/${type}/${entityUid}`
        );
    }

    async createAttachment(
        accountUid: string,
        type: AttachmentEntityType,
        params: CreateAttachmentParameters
    ): Promise<EntityAttachmentDto> {
        const exported = params.export();

        if (!exported.name) {
            throw new SmartlingException("Attachment name is required.");
        }

        if (!exported.file && !exported.filePath) {
            throw new SmartlingException("Attachment file is required.");
        }

        const file = exported.file
            ? exported.file as NodeJS.ReadableStream | Buffer
            : fs.createReadStream(fs.realpathSync(exported.filePath as string));

        const defaultFileName = exported.filePath
            ? path.basename(exported.filePath as string)
            : exported.name as string;
        const fileName = exported.fileName as string ?? defaultFileName;

        const formData = new FormData();

        formData.append("name", exported.name as string);

        if (exported.description) {
            formData.append("description", exported.description as string);
        }

        if (exported.localeId) {
            formData.append("localeId", exported.localeId as string);
        }

        ((exported.entityUids ?? []) as Array<string>).forEach((entityUid) => {
            formData.append("entityUids", entityUid);
        });

        formData.append("file", file, fileName);

        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/${type}/attachments`,
            formData,
            false,
            fixContentTypeHeaderCase(formData)
        );
    }

    async downloadAttachment(
        accountUid: string,
        type: AttachmentEntityType,
        attachmentUid: string
    ): Promise<ArrayBuffer> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/${type}/attachments/${attachmentUid}`,
            null,
            ResponseBodyType.ARRAY_BUFFER
        );
    }

    async downloadAttachmentWithMetadata(
        accountUid: string,
        type: AttachmentEntityType,
        attachmentUid: string,
        options?: DownloadAttachmentOptions
    ): Promise<TranslatedFileDto> {
        const response: Response = await this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/${type}/attachments/${attachmentUid}`,
            null,
            ResponseBodyType.RAW_RESPONSE
        );

        if (options?.maxBytes === undefined) {
            return await SmartlingBaseFileApi.downloadResponseToTranslatedFileDto(response);
        }

        const fileContent = await SmartlingAttachmentsApi.readBodyWithLimit(
            response,
            options.maxBytes
        );

        // Reuse the header parsing (file name, content type) of the shared helper, handing it the
        // body that was already read under the size limit.
        return await SmartlingBaseFileApi.downloadResponseToTranslatedFileDto({
            headers: response.headers,
            arrayBuffer: async () => fileContent
        } as unknown as Response);
    }

    /**
     * The attachments service answers with chunked transfer encoding and no Content-Length, so the
     * limit is enforced while reading: the body is abandoned as soon as it grows past maxBytes.
     */
    private static async readBodyWithLimit(
        response: Response,
        maxBytes: number
    ): Promise<ArrayBuffer> {
        const tooLarge = (size: string): SmartlingException => new SmartlingException(
            `Attachment size ${size} exceeds the maximum allowed ${maxBytes} bytes.`
        );

        const declaredLength = Number(response.headers.get("content-length"));

        if (declaredLength > maxBytes) {
            throw tooLarge(`${declaredLength} bytes`);
        }

        const body = response.body as unknown as AsyncIterable<Uint8Array> | null;

        if (!body || typeof body[Symbol.asyncIterator] !== "function") {
            const content = await response.arrayBuffer();

            if (content.byteLength > maxBytes) {
                throw tooLarge(`${content.byteLength} bytes`);
            }

            return content;
        }

        let chunks: Array<Uint8Array> = [];
        let received = 0;

        // Leaving the loop early (the throw below) destroys the underlying stream.
        // eslint-disable-next-line no-restricted-syntax
        for await (const chunk of body) {
            received += chunk.byteLength;

            if (received > maxBytes) {
                throw tooLarge(`more than ${maxBytes} bytes`);
            }

            chunks = chunks.concat(chunk);
        }

        const content = Buffer.concat(chunks);
        const end = content.byteOffset + content.byteLength;

        return content.buffer.slice(content.byteOffset, end) as ArrayBuffer;
    }
}
