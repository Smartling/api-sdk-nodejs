import * as fs from "fs";
import FormData from "form-data";
import { SmartlingBaseApi } from "../base/index";
import { SmartlingAuthApi } from "../auth/index";
import { Logger } from "../logger";
import { CreateBatchParameters } from "./params/create-batch-parameters";
import { UploadBatchFileParameters } from "./params/upload-batch-file-parameters";

/*
 eslint class-methods-use-this: [
     "error", {
         "exceptMethods": [
             "alterRequestData"
         ]
     }
 ]
 */

export class SmartlingJobBatchesApi extends SmartlingBaseApi {
    constructor(authApi: SmartlingAuthApi, logger: Logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/job-batches-api/v1/projects`;
    }

    alterRequestData(uri: string, opts: Record<string, unknown>) {
        if (uri.match(/jobs-batch-api\/.*\/projects\/.*\/batches\/.*\/file$/g)) {
            const formData = new FormData();

            Object.keys(opts.body).forEach((key) => {
                if (key === "file") {
                    formData.append(key, fs.createReadStream(
                        fs.realpathSync(opts.body[key])
                    ));
                } else if (Array.isArray(opts.body[key])) {
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

    async createBatch(projectId: string, params: CreateBatchParameters) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/batches`,
            JSON.stringify(params.export())
        );
    }

    async uploadBatchFile(projectId: string, batchUid: string, params: UploadBatchFileParameters) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/batches/${batchUid}/file`,
            JSON.stringify(params.export())
        );
    }

    async executeBatch(projectId: string, batchUid: string) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/batches/${batchUid}`,
            JSON.stringify({
                action: "execute"
            })
        );
    }

    async getBatchStatus(projectId: string, batchUid: string) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/batches/${batchUid}`
        );
    }
}
