import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import * as queryString from "querystring";
import { CreateAuditLogParameters } from "./params/create-audit-log-parameters";
import { SearchAuditLogParameters } from "./params/search-audit-log-parameters";
import { AuditLogDto } from "./dto/audit-log-dto";
import { Response } from "../http/response";

export class SmartlingAuditLogApi extends SmartlingBaseApi {
    private readonly authApi: SmartlingAuthApi;
    private readonly entrypoint: string;

    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/audit-log-api/v2`;
    }

    public async createAccountLevelLogRecord(accountUid: string, payload: CreateAuditLogParameters): Promise<void> {
        await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/logs`,
            JSON.stringify(payload.export())
        );
    }

    public async createProjectLevelLogRecord(projectUid: string, payload: CreateAuditLogParameters): Promise<void> {
        await this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectUid}/logs`,
            JSON.stringify(payload.export())
        );
    }

    public async searchAccountLevelLogRecord(accountUid: string, query: SearchAuditLogParameters): Promise<Response<AuditLogDto>> {
        return this.mapItemsToDtos(
            await this.makeRequest(
                "get",
                `${this.entrypoint}/accounts/${accountUid}/logs?${queryString.stringify(query.export())}`
            )
        );
    }

    public async searchProjectLevelLogRecord(projectUid: string, query: SearchAuditLogParameters): Promise<Response<AuditLogDto>> {
        return this.mapItemsToDtos(
            await this.makeRequest(
                "get",
                `${this.entrypoint}/projects/${projectUid}/logs?${queryString.stringify(query.export())}`
            )
        );
    }

    private mapItemsToDtos(response: Response<object>): Response<AuditLogDto> {
        const retrievedItems = response.items || [];
        const items: Array<AuditLogDto> = retrievedItems.map((item) => {
            if (item["actionTime"]) {
                item["actionTime"] = new Date(item["actionTime"]);
            }

            if (item["translationJobDueDate"]) {
                item["translationJobDueDate"] = new Date(item["translationJobDueDate"]);
            }

            return item as AuditLogDto;
        });

        return {
            items,
            totalCount: response.totalCount
        };
    }
}
