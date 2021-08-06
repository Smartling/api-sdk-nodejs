import { WorkflowStepSummaryReportItemDto } from "./workflow-step-summary-report-item-dto";

interface WorkflowProgressReportItemDto {
    workflowName: string;
    workflowUid: string;
    workflowStepSummaryReportItemList: Array<WorkflowStepSummaryReportItemDto>;
}

export { WorkflowProgressReportItemDto };
