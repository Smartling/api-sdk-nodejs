import { EstimateReportType } from "../params/estimate-report-type";
import { EstimateReportStatus } from "../params/estimate-report-status";

interface GeneratedEstimateReportDto {
    reportUid: string;
    reportType: EstimateReportType;
    reportStatus: EstimateReportStatus;
}

export { GeneratedEstimateReportDto };
