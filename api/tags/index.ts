import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { TagDto } from "./dto/tag-dto";
import { StringTagsDto } from "./dto/string-tags-dto";
import { ListAccountTagsParameters } from "./params/list-account-tags-parameters";
import { ListProjectTagsParameters } from "./params/list-project-tags-parameters";
import { SearchStringTagsParameters } from "./params/search-string-tags-parameters";
import { AddTagsToStringsParameters } from "./params/add-tags-to-strings-parameters";
import { RemoveTagsFromStringsParameters } from "./params/remove-tags-from-strings-parameters";
import { RemoveAllTagsFromStringsParameters } from "./params/remove-all-tags-from-strings-parameters";
import { ProjectIdTagDto } from "./dto/project-id-tag-dto";

export class SmartlingTagsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/tags-api/v2`;
    }

    async listAccountTags(
        accountUid: string,
        params: ListAccountTagsParameters
    ): Promise<SmartlingListResponse<ProjectIdTagDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/tags`,
            JSON.stringify(params.export())
        );
    }

    async listProjectTags(
        projectId: string,
        params: ListProjectTagsParameters
    ): Promise<SmartlingListResponse<TagDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectId}/tags`,
            params.export()
        );
    }

    async searchStringTags(
        projectId: string,
        params: SearchStringTagsParameters
    ): Promise<Array<StringTagsDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/strings/tags/search`,
            JSON.stringify(params.export())
        );
    }

    async addTagsToStrings(
        projectId: string,
        params: AddTagsToStringsParameters
    ): Promise<void> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/strings/tags/add`,
            JSON.stringify(params.export())
        );
    }

    async removeTagsFromStrings(
        projectId: string,
        params: RemoveTagsFromStringsParameters
    ): Promise<void> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/strings/tags/remove`,
            JSON.stringify(params.export())
        );
    }

    async removeAllTagsFromStrings(
        projectId: string,
        params: RemoveAllTagsFromStringsParameters
    ): Promise<Record<string, unknown>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/strings/tags/remove/all`,
            JSON.stringify(params.export())
        );
    }
}
