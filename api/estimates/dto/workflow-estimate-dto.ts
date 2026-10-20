import { PriceInformationDto } from "./price-information-dto";
import { WorkflowStepEstimateDto } from "./workflow-step-estimate-dto";

interface WorkflowEstimateDto {
    totalWordCount: number;
    totalWeightedWordCount: number;
    // Null when every step estimate it's aggregated from also had a null character count -
    // confirmed via WorkflowEstimateConverter's explicit `.orElse(null)` fallback (the sibling
    // word-count fields fall back to 0 instead).
    totalCharacterCount: number | null;
    totalPageCount: number | null;
    workflowUid: string;
    workflowName: string;
    workflowStepEstimates: Array<WorkflowStepEstimateDto>;
    priceInformation: PriceInformationDto | null;
}

export { WorkflowEstimateDto };
