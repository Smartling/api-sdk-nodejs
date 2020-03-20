import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import AuditLog from "./audit-log";
import Response from "./response"
import * as queryString from "querystring";
import Query from "./query";

class SmartlingAuditLogApi extends SmartlingBaseApi {
    private readonly authApi: SmartlingAuthApi;
    private readonly entrypoint: string;

    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/audit-log-api/v2`;
    }

    async addAccountLog(accountUid: string, payload: AuditLog): Promise<object> {
        return this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/logs`,
            JSON.stringify(payload)
        );
    }

    async addProjectLog(projectUid: string, payload: AuditLog): Promise<object> {
        return this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectUid}/logs`,
            JSON.stringify(payload)
        );
    }

    async getAccountLogs(accountUid: string, query: Query): Promise<Response> {
        return this.buildResponse(this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/logs?${queryString.stringify(query)}`
        ));
    }

    async getProjectLogs(projectUid: string, query: Query): Promise<Response> {
        return this.buildResponse(this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectUid}/logs?${queryString.stringify(query)}`
        ));
    }

    private buildResponse(response: Response): Response {
        const items = [];
        response.items.forEach(function (item) {
            const date = new Date(item.actionTime);
            const logItem = new AuditLog(date, item.actionType);
            Object.assign(logItem, item);
            if (item.translationJobDueDate) {
                logItem.translationJobDueDate = new Date(item.translationJobDueDate);
            }
            logItem.actionTime = date;
            items.push(logItem);
        });

        return {
            totalCount: response.totalCount,
            items
        };
    }
}

export default SmartlingAuditLogApi;
