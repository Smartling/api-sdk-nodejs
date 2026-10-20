import { PriceInformationDto } from "./price-information-dto";
import { WorkflowStepEstimateDto } from "./workflow-step-estimate-dto";

interface WorkflowEstimateDto {
    totalWordCount: number;
    totalWeightedWordCount: number;
    totalCharacterCount: number;
    totalPageCount: number | null;
    workflowUid: string;
    workflowName: string;
    workflowStepEstimates: Array<WorkflowStepEstimateDto>;
    priceInformation: PriceInformationDto | null;
}

export { WorkflowEstimateDto };
