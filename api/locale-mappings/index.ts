import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { LocaleMappingDto } from "./dto/locale-mapping-dto";
import { LocaleMappingParameters } from "./params/locale-mapping-parameters";
import { ListLocaleMappingsParameters } from "./params/list-locale-mappings-parameters";

export class SmartlingLocaleMappingsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);

        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/locale-mappings-api/v2`;
    }

    async createMappingForAccount(
        accountUid: string,
        params: LocaleMappingParameters,
        integrationId?: string
    ): Promise<LocaleMappingDto> {
        return await this.makeRequest(
            "post",
            `${this.scopeUrl("accounts", accountUid, integrationId)}/locale-mappings`,
            JSON.stringify(params.export())
        );
    }

    async createMappingForProject(
        projectId: string,
        params: LocaleMappingParameters,
        integrationId?: string
    ): Promise<LocaleMappingDto> {
        return await this.makeRequest(
            "post",
            `${this.scopeUrl("projects", projectId, integrationId)}/locale-mappings`,
            JSON.stringify(params.export())
        );
    }

    async updateMappingForAccount(
        accountUid: string,
        localeMappingUid: string,
        params: LocaleMappingParameters
    ): Promise<LocaleMappingDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/accounts/${accountUid}/locale-mappings/${localeMappingUid}`,
            JSON.stringify(params.export())
        );
    }

    async updateMappingForProject(
        projectId: string,
        localeMappingUid: string,
        params: LocaleMappingParameters
    ): Promise<LocaleMappingDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/projects/${projectId}/locale-mappings/${localeMappingUid}`,
            JSON.stringify(params.export())
        );
    }

    async deleteMappingForAccount(
        accountUid: string,
        localeMappingUid: string
    ): Promise<void> {
        await this.makeRequest(
            "delete",
            `${this.entrypoint}/accounts/${accountUid}/locale-mappings/${localeMappingUid}`
        );
    }

    async deleteMappingForProject(
        projectId: string,
        localeMappingUid: string
    ): Promise<void> {
        await this.makeRequest(
            "delete",
            `${this.entrypoint}/projects/${projectId}/locale-mappings/${localeMappingUid}`
        );
    }

    async getMappingForAccount(
        accountUid: string,
        localeMappingUid: string
    ): Promise<LocaleMappingDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/locale-mappings/${localeMappingUid}`
        );
    }

    async getMappingForProject(
        projectId: string,
        localeMappingUid: string
    ): Promise<LocaleMappingDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectId}/locale-mappings/${localeMappingUid}`
        );
    }

    async listMappingsForAccount(
        accountUid: string,
        params?: ListLocaleMappingsParameters
    ): Promise<SmartlingListResponse<LocaleMappingDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/locale-mappings`,
            params?.export()
        );
    }

    async listMappingsForProject(
        projectId: string,
        params?: ListLocaleMappingsParameters
    ): Promise<SmartlingListResponse<LocaleMappingDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectId}/locale-mappings`,
            params?.export()
        );
    }

    private scopeUrl(scope: "accounts" | "projects", scopeId: string, integrationId?: string): string {
        const base = `${this.entrypoint}/${scope}/${scopeId}`;

        return integrationId ? `${base}/integrations/${encodeURIComponent(integrationId)}` : base;
    }
}
