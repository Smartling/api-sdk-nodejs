import { SmartlingBaseApi } from "../base";
import { SmartlingAuthApi } from "../auth";
import * as fs from "fs";
import FormData from "form-data";

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
    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/job-batches-api/v1/projects`;
    }

    alterRequestData(uri, opts) {
        if (uri.match(/jobs-batch-api\/.*\/projects\/.*\/batches\/.*\/file$/g)) {
            const formData: any = new FormData();

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

    async createBatch(projectId, params) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/batches`,
            JSON.stringify(params.export())
        );
    }

    async uploadBatchFile(projectId, batchUid, params) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/batches/${batchUid}/file`,
            JSON.stringify(params.export())
        );
    }

    async executeBatch(projectId, batchUid) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/batches/${batchUid}`,
            JSON.stringify({
                action: "execute"
            })
        );
    }

    async getBatchStatus(projectId, batchUid) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/batches/${batchUid}`
        );
    }
}