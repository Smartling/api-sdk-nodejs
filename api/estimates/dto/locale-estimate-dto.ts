import { PriceInformationDto } from "./price-information-dto";
import { WorkflowEstimateDto } from "./workflow-estimate-dto";

interface LocaleEstimateDto {
    totalWordCount: number;
    totalWeightedWordCount: number;
    totalCharacterCount: number;
    totalPageCount: number | null;
    localeId: string;
    localeDescription: string;
    workflowEstimates: Array<WorkflowEstimateDto>;
    priceInformation: PriceInformationDto | null;
}

export { LocaleEstimateDto };
