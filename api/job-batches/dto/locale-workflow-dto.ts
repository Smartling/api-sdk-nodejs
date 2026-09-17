import { LocaleWorkflowContentAssignmentDto } from "./locale-workflow-content-assignment-dto";
import { TranslationJobWorkflowStepDueDateDto } from "./translation-job-workflow-step-due-date-dto";

interface LocaleWorkflowDto {
    targetLocaleId: string;
    workflowUid?: string;
    contentAssignments?: Array<LocaleWorkflowContentAssignmentDto>;
    translationJobWorkflowStepDueDates?: Array<TranslationJobWorkflowStepDueDateDto>;
}

export { LocaleWorkflowDto };
