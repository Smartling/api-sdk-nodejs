import { EstimateReportType } from "../params/estimate-report-type";
import { EstimateReportStatus } from "../params/estimate-report-status";

interface EstimateReportStatusDto {
    reportUid: string;
    reportStatus: EstimateReportStatus;
    totalStrings: number;
    percentComplete: number;
    reportType: EstimateReportType;
    createdDate: Date;
}

export { EstimateReportStatusDto };
