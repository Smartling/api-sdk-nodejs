import string2fileStream from "string-to-file-stream";
import FormData from "form-data";
import { SmartlingBaseApi } from "../base/index";
import { SmartlingAuthApi } from "../auth/index";
import { ContextUploadParameters } from "./params/context-upload-parameters";
import { ContextDto } from "./dto/context-dto";
import { ContextAutomaticMatchParameters } from "./params/context-automatic-match-parameters";
import { ContextMatchAsyncDto } from "./dto/context-match-async-dto";
import { CreateBindingsParameters } from "./params/create-bindings-parameters";
import { ContextSourceDto } from "./dto/context-source-dto";
import { ContextHttpResponse } from "./context-http-response";
import { ListParameters } from "./params/list-parameters";
import { Logger } from "../logger";
import { RawContextDto } from "./dto/raw-context-dto";

export class SmartlingContextApi extends SmartlingBaseApi {
    constructor(authApi: SmartlingAuthApi, logger: Logger, smartlingApiBaseUrl: string) {
        super(logger);

        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/context-api/v2/projects`;
    }

    async upload(
        projectId: string, params: ContextUploadParameters, contextSource?: ContextSourceDto
    ): Promise<ContextDto> {
        return this.mapRawContextItemToDto(await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/contexts`,
            params.export(),
            false,
            {
                "X-SL-Context-Source": contextSource ? `group=${contextSource.group};name=${contextSource.name};version=${contextSource.version}` : ""
            }
        ));
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
        return this.mapRawContextItemsToDtos(
            await this.makeRequest(
                "get",
                `${this.entrypoint}/${projectId}/contexts`,
                params.export()
            )
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

    protected mapRawContextItemsToDtos(
        response: ContextHttpResponse<RawContextDto>
    ): ContextHttpResponse<ContextDto> {
        const retrievedItems: Array<RawContextDto> = response.items || [];
        const items: Array<ContextDto> = retrievedItems.map(
            item => this.mapRawContextItemToDto(item)
        );

        return {
            items,
            offset: response.offset
        };
    }

    /* eslint-disable-next-line class-methods-use-this */
    protected mapRawContextItemToDto(rawContextDto: RawContextDto): ContextDto {
        return {
            contextUid: rawContextDto.contextUid,
            name: rawContextDto.name,
            contextType: rawContextDto.contextType,
            created: new Date(rawContextDto.created)
        };
    }

    /* eslint-disable-next-line class-methods-use-this */
    alterRequestData(uri: string, opts: Record<string, unknown>): Record<string, unknown> {
        if (uri.match(/context-api\/v2\/projects\/.*\/contexts$/g)) {
            if (!opts.body) {
                return opts;
            }

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
