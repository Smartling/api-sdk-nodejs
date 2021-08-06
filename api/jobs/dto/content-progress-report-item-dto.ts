import { WorkflowProgressReportItemDto } from "./workflow-progress-report-item-dto";
import { FileProgressItemDto } from "./file-progress-item-dto";
import { SummaryReportItemDto } from "./summary-report-item-dto";

interface ContentProgressReportItemDto {
    targetLocaleDescription: string;
    targetLocaleId: string;
    unuathorizedProgressReport: {
        stringCount: number;
        wordCount: number;
    };
    workflowProgressReportList: Array<WorkflowProgressReportItemDto>;
    progress: FileProgressItemDto;
    summaryReport: Array<SummaryReportItemDto>;
}

export { ContentProgressReportItemDto };
