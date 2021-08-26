import { WorkflowProgressReportItemDto } from "./workflow-progress-report-item-dto";
import { ProgressItemDto } from "./progress-item-dto";
import { SummaryReportItemDto } from "./summary-report-item-dto";

interface ContentProgressReportItemDto {
    targetLocaleDescription: string;
    targetLocaleId: string;
    unuathorizedProgressReport: {
        stringCount: number;
        wordCount: number;
    };
    workflowProgressReportList: Array<WorkflowProgressReportItemDto>;
    progress: ProgressItemDto;
    summaryReport: Array<SummaryReportItemDto>;
}

export { ContentProgressReportItemDto };
