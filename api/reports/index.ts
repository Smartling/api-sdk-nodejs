import { WordCountParameters } from "./params/word-count-parameters";
import { WordCountDto } from "./dto/word-count-dto";
import { ReportResponse } from "./dto/report-response";
import { StepTypeDto } from "./dto/step-types";
import {SmartlingBaseApi} from "../base";
import {AccessTokenProvider} from "../auth/access-token-provider";
import {Logger} from "../logger";

export class SmartlingReportServiceApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);

        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/reports-api/v3`;
    }

    async getWorkflowStepTypes(): Promise<ReportResponse<StepTypeDto>> {
        return await this.makeRequest(
            "GET",
            `${this.entrypoint}/word-count/dictionary/step-types`
        );
    }

    async getWordsCountReport(params: WordCountParameters): Promise<ReportResponse<WordCountDto>> {
        return await this.makeRequest(
            "GET",
            `${this.entrypoint}/word-count`,
            params.export()
        );
    }
}
