import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { ResponseBodyType } from "../base/enum/response-body-type";
import { ListJobEstimateReportsParameters } from "./params/list-job-estimate-reports-parameters";
import { GenerateJobEstimateReportParameters } from "./params/generate-job-estimate-report-parameters";
import { ModifyEstimateReportTagsParameters } from "./params/modify-estimate-report-tags-parameters";
import { EstimateReportDto } from "./dto/estimate-report-dto";
import { GeneratedEstimateReportDto } from "./dto/generated-estimate-report-dto";
import { EstimateReportStatusDto } from "./dto/estimate-report-status-dto";
import { EstimateReportTagsDto } from "./dto/estimate-report-tags-dto";

export class SmartlingEstimatesApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/estimates-api/v2/projects`;
    }

    async getJobFuzzyEstimateReports(
        projectId: string, translationJobUid: string, params: ListJobEstimateReportsParameters
    ): Promise<SmartlingListResponse<EstimateReportDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/reports/fuzzy`,
            params.export()
        );
    }

    async generateJobFuzzyEstimateReport(
        projectId: string, translationJobUid: string, params: GenerateJobEstimateReportParameters
    ): Promise<GeneratedEstimateReportDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/reports/fuzzy`,
            JSON.stringify(params.export())
        );
    }

    async getJobCostEstimateReports(
        projectId: string, translationJobUid: string, params: ListJobEstimateReportsParameters
    ): Promise<SmartlingListResponse<EstimateReportDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/reports/cost`,
            params.export()
        );
    }

    async generateJobCostEstimateReport(
        projectId: string, translationJobUid: string, params: GenerateJobEstimateReportParameters
    ): Promise<GeneratedEstimateReportDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/reports/cost`,
            JSON.stringify(params.export())
        );
    }

    async getEstimateReport(projectId: string, reportUid: string): Promise<EstimateReportDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/reports/${reportUid}`
        );
    }

    async deleteEstimateReport(projectId: string, reportUid: string): Promise<void> {
        await this.makeRequest(
            "delete",
            `${this.entrypoint}/${projectId}/reports/${reportUid}`
        );
    }

    async getEstimateReportStatus(
        projectId: string, reportUid: string
    ): Promise<EstimateReportStatusDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/reports/${reportUid}/status`
        );
    }

    async modifyEstimateReportTags(
        projectId: string, reportUid: string, params: ModifyEstimateReportTagsParameters
    ): Promise<EstimateReportTagsDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/${projectId}/reports/${reportUid}/tags`,
            JSON.stringify(params.export())
        );
    }

    async downloadEstimateReport(projectId: string, reportUid: string): Promise<ArrayBuffer> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/reports/${reportUid}/download`,
            { format: "csv" },
            ResponseBodyType.ARRAY_BUFFER
        );
    }
}
