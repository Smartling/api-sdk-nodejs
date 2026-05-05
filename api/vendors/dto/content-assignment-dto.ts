import { WorkflowStepType } from "./workflow-step-type";

interface ContentAssignmentDto {
    accountUid: string;
    accountName: string;
    projectUid: string;
    projectName: string;
    localeId: string;
    workflowUid: string;
    workflowName: string;
    workflowStepUid: string;
    workflowStepName: string;
    workflowStepType: WorkflowStepType;
    translationJobUid: string;
    translationJobName: string;
    translationJobWorkflowStepDueDate: Date;
    translationJobOverallDueDate: Date;
    userUid: string | null;
    userFirstName: string | null;
    userLastName: string | null;
    userEmail: string | null;
    agencyUid: string | null;
    agencyName: string | null;
    wordCount: number;
    workflowStepOrder: number;
    assignmentEnabled: boolean;
}

export { ContentAssignmentDto };
