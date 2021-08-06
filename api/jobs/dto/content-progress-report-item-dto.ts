import { WorkflowProgressReportItemDto } from "./workflow-progress-report-item-dto";

interface ContentProgressReportItemDto {
    targetLocaleDescription: string;
    targetLocaleId: string;
    unuathorizedProgressReport: {
        stringCount: number;
        wordCount: number;
    };
    workflowProgressReportList: Array<WorkflowProgressReportItemDto>
}

export { ContentProgressReportItemDto };
