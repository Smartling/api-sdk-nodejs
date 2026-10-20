import { EstimateReportType } from "../params/estimate-report-type";
import { EstimateReportStatus } from "../params/estimate-report-status";
import { EstimateReportContentCoverage } from "../params/estimate-report-content-coverage";
import { LocaleEstimateDto } from "./locale-estimate-dto";
import { PriceInformationDto } from "./price-information-dto";

interface EstimateReportDto {
    reportUid: string;
    projectId: string;
    translationJobUid: string | null;
    schemaType: string;
    reportType: EstimateReportType;
    schema: string;
    reportStatus: EstimateReportStatus;
    totalStrings: number;
    creatorUserUid: string;
    creatorUserRole: string;
    contentCoverage: EstimateReportContentCoverage;
    creatorAgencyUid: string | null;
    createdDate: Date;
    tags: Array<string> | null;
    totalWordCount: number;
    totalWeightedWordCount: number;
    totalCharacterCount: number;
    // Null unless the project bills by page (confirmed via a real response - unlike the
    // word/character counters, which defaulted to 0 rather than null).
    totalPageCount: number | null;
    warnings: Array<string> | null;
    errors: Array<string> | null;
    localeEstimates: Array<LocaleEstimateDto> | null;
    priceInformation: Array<PriceInformationDto> | null;
}

export { EstimateReportDto };
