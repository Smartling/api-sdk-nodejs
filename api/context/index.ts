import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import {ContextUploadParameters} from "./params/context-upload-parameters"
import {ContextDto} from "./dto/context-dto";
import {ContextAutomaticMatchParameters} from "./params/context-automatic-match-parameters";
import {ContextMatchAsyncDto} from "./dto/context-match-async-dto";
import FormData from "form-data";
import * as fs from 'fs';
import string2fileStream from "string-to-file-stream";
import { CreateBindingsParameters } from "./params/create-bindings-parameters";

export class SmartlingContextApi extends SmartlingBaseApi {
    protected readonly authApi: SmartlingAuthApi;
    protected readonly entrypoint: string;

    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);

        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/context-api/v2/projects`;
    }

    async upload(projectId: string, params: ContextUploadParameters, contextSource: string = ""): Promise<ContextDto> {
        return this.mapContextItemToDto(await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/contexts`,
            params.export(),
            false,
            {
                "X-SL-Context-Source": contextSource
            }
        ));
    }

    async runAutomaticMatch(projectId: string, contextUid: string, params: ContextAutomaticMatchParameters): Promise<ContextMatchAsyncDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/contexts/${contextUid}/match/async`,
            JSON.stringify(params.export())
        );
    }

    async createStringsToContextBindings(projectId: string, params: CreateBindingsParameters): Promise<boolean> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/bindings`,
            JSON.stringify(params.export())
        );
    }

    protected mapContextItemToDto(contextDtoResponse: any): ContextDto {
        if (contextDtoResponse["created"]) {
            contextDtoResponse["created"] = new Date(contextDtoResponse["created"]);
        }

        return contextDtoResponse as ContextDto;
    }

    alterRequestData(uri, opts) {
        if (uri.match(/context-api\/v2\/projects\/.*\/contexts$/g)) {
            const formData = new FormData();

            Object.keys(opts.body).forEach((key) => {
                if (key === "content") {
                    formData.append(key, string2fileStream(opts.body[key]));
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
}
