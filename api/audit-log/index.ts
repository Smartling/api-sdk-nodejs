import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import Payload from "./payload";

class SmartlingAuditLogApi extends SmartlingBaseApi {
    private readonly authApi: SmartlingAuthApi;
    private readonly entrypoint: string;

    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/audit-log-api/v2`;
    }

    async addAccountLog(accountUid: string, payload: Payload) {
        return this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/logs`,
            payload.stringify()
        );
    }

    async addProjectLog(projectUid: string, payload: Payload): Promise<any> {
        return this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectUid}/logs`,
            payload.stringify()
        );
    }

    async getAccountLogs(accountUid: string, query: string, offset: number = 0, limit: number = 10, startTime: string = "now()", endTime: string = "now() - 30d", sort: string = "time:desc") {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/logs` +
                `?q=${query}&offset=${offset}&limit=${limit}&startTime=${startTime}&endTime=${endTime}&sort=${sort}`
        );
    }

    async getProjectLogs(projectUid: string, query: string, offset: number = 0, limit: number = 10, startTime: string = "now()", endTime: string = "now() - 30d", sort: string = "time:desc") {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectUid}/logs` +
                `?q=${query}&offset=${offset}&limit=${limit}&startTime=${startTime}&endTime=${endTime}&sort=${sort}`
        );
    }
}

export default SmartlingAuditLogApi;
