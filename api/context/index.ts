import string2fileStream from "string-to-file-stream";
import FormData from "form-data";
import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { ContextUploadParameters } from "./params/context-upload-parameters";
import { ContextDto } from "./dto/context-dto";
import { ContextAutomaticMatchParameters } from "./params/context-automatic-match-parameters";
import { ContextMatchAsyncDto } from "./dto/context-match-async-dto";
import { CreateBindingsParameters } from "./params/create-bindings-parameters";
import { ContextSourceDto } from "./dto/context-source-dto";
import { ContextHttpResponse } from "./context-http-response";
import { ListParameters } from "./params/list-parameters";
import { Logger } from "../logger";
import { ResponseBodyType } from "../base/enum/response-body-type";
import { AsyncProcessDto } from "./dto/async-process-dto";
import { AsyncMatchDto } from "./dto/async-match-dto";
import { MatchStatsDto } from "./dto/match-stats-dto";
import { ProcessResultDto } from "./dto/process-result-dto";
import { BindingDetailsDto } from "./dto/binding/binding-details-dto";
import { DeleteContextsAsyncParameters } from "./params/delete-contexts-async-parameters";
import { ContextUploadAndMatchParameters } from "./params/context-upload-and-match-parameters";
import { ListBindingsParameters } from "./params/list-bindings-parameters";
import { DeleteBindingsParameters } from "./params/delete-bindings-parameters";

export class SmartlingContextApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);

        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/context-api/v2/projects`;
    }

    async upload(
        projectId: string, params: ContextUploadParameters, contextSource?: ContextSourceDto
    ): Promise<ContextDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/contexts`,
            params.export(),
            false,
            SmartlingContextApi.contextSourceHeaders(contextSource)
        );
    }

    async getContext(projectId: string, contextUid: string): Promise<ContextDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/contexts/${contextUid}`
        );
    }

    async downloadContextContent(
        projectId: string,
        contextUid: string,
        responseType: ResponseBodyType = ResponseBodyType.ARRAY_BUFFER
    ): Promise<ArrayBuffer | string> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/contexts/${contextUid}/content`,
            null,
            responseType
        );
    }

    async deleteContextsAsync(
        projectId: string, params: DeleteContextsAsyncParameters
    ): Promise<AsyncProcessDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/contexts/remove/async`,
            JSON.stringify(params.export())
        );
    }

    async uploadAndMatchContext(
        projectId: string, params: ContextUploadAndMatchParameters, contextSource?: ContextSourceDto
    ): Promise<AsyncMatchDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/contexts/upload-and-match-async`,
            params.export(),
            false,
            SmartlingContextApi.contextSourceHeaders(contextSource)
        );
    }

    async getMatchResults(projectId: string, matchId: string): Promise<MatchStatsDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/match/${matchId}`
        );
    }

    async getProcessResults(projectId: string, processUid: string): Promise<ProcessResultDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/processes/${processUid}`
        );
    }

    async listBindings(
        projectId: string, params: ListBindingsParameters
    ): Promise<ContextHttpResponse<BindingDetailsDto>> {
        const offset = params.getOffset();
        const query = offset ? `?offset=${encodeURIComponent(offset)}` : "";

        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/bindings/list${query}`,
            JSON.stringify(params.export())
        );
    }

    async deleteBindings(projectId: string, params: DeleteBindingsParameters): Promise<boolean> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/bindings/remove`,
            JSON.stringify(params.export())
        );
    }

    async delete(projectId: string, contextUid: string): Promise<boolean> {
        return await this.makeRequest(
            "delete",
            `${this.entrypoint}/${projectId}/contexts/${contextUid}`
        );
    }

    async listContexts(
        projectId: string, params: ListParameters
    ): Promise<ContextHttpResponse<ContextDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/contexts`,
            params.export()
        );
    }

    async runAutomaticMatch(
        projectId: string, contextUid: string, params: ContextAutomaticMatchParameters
    ): Promise<ContextMatchAsyncDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/contexts/${contextUid}/match/async`,
            JSON.stringify(params.export())
        );
    }

    async createStringsToContextBindings(
        projectId: string, params: CreateBindingsParameters
    ): Promise<boolean> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/bindings`,
            JSON.stringify(params.export())
        );
    }

    private static contextSourceHeaders(contextSource?: ContextSourceDto): Record<string, string> {
        return {
            "X-SL-Context-Source": contextSource ? `group=${contextSource.group};name=${contextSource.name};version=${contextSource.version}` : ""
        };
    }

    /* eslint-disable-next-line class-methods-use-this */
    alterRequestData(uri: string, opts: Record<string, unknown>): Record<string, unknown> {
        if (uri.match(/context-api\/v2\/projects\/.*\/contexts(\/upload-and-match-async)?$/g)) {
            if (!opts.body) {
                return opts;
            }

            const formData = new FormData();

            Object.keys(opts.body).forEach((key) => {
                if (key === "content") {
                    formData.append(key, string2fileStream(opts.body[key]));
                } else if (key === "matchParams") {
                    formData.append(key, JSON.stringify(opts.body[key]), { contentType: "application/json" });
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
