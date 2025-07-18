import FormData from "form-data";
import { SmartlingBaseApi } from "../base";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { CreateBatchParameters } from "./params/create-batch-parameters";
import { UploadBatchFileParameters } from "./params/upload-batch-file-parameters";
import { BatchStatusDto } from "./dto/batch-status-dto";
import { BatchDto } from "./dto/batch-dto";
import { CancelBatchFileParameters } from "./params/cancel-batch-file-parameters";
import { RegisterBatchFileParameters } from "./params/register-batch-file-parameters";
import { BatchListItemDto } from "./dto/batch-list-item-dto";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { ListBatchesParameters } from "./params/list-batches-parameters";
import { BaseJobDto } from "../jobs/dto/base-job-dto";
import { JobBatchesParameters } from "./params/job-batches-parameters";

export class SmartlingJobBatchesApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/job-batches-api/v2/projects`;
    }

    /* eslint-disable-next-line class-methods-use-this */
    alterRequestData(uri: string, opts: Record<string, unknown>): Record<string, unknown> {
        if (uri.match(/job-batches-api\/.*\/projects\/.*\/batches\/.*\/file$/g)) {
            const formData = new FormData();

            Object.keys(opts.body).forEach((key) => {
                if (Array.isArray(opts.body[key])) {
                    opts.body[key].forEach((value) => {
                        formData.append(`${key}[]`, value);
                    });
                } else {
                    formData.append(key, opts.body[key]);
                }
            });

            opts.headers["Content-Type"] = formData.getHeaders()["content-type"];
            opts.body = formData;
        }

        return opts;
    }

    async createBatch(projectId: string, params: CreateBatchParameters): Promise<BatchDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/batches`,
            JSON.stringify(params.export())
        );
    }

    async createJob(
        projectId: string, nameTemplate: string, params: JobBatchesParameters
    ): Promise<BaseJobDto> {
        if (params === undefined) {
            params = new JobBatchesParameters();
        }
        params.set("nameTemplate", nameTemplate);
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs`,
            JSON.stringify(params.export())
        );
    }

    async registerBatchFile(
        projectId: string, batchUid: string, params: RegisterBatchFileParameters
    ): Promise<BatchDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/${projectId}/batches/${batchUid}`,
            JSON.stringify(params.export())
        );
    }

    async cancelBatchFile(
        projectId: string, batchUid: string, params: CancelBatchFileParameters
    ): Promise<BatchDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/${projectId}/batches/${batchUid}`,
            JSON.stringify(params.export())
        );
    }

    async uploadBatchFile(
        projectId: string, batchUid: string, params: UploadBatchFileParameters
    ): Promise<boolean> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/batches/${batchUid}/file`,
            params.export()
        );
    }

    async getBatchStatus(projectId: string, batchUid: string): Promise<BatchStatusDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/batches/${batchUid}`
        );
    }

    async listBatches(projectId: string, params: ListBatchesParameters
    ): Promise<SmartlingListResponse<BatchListItemDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/batches`,
            params.export()

        );
    }
}
