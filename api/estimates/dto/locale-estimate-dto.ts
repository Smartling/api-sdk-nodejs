import { PriceInformationDto } from "./price-information-dto";
import { WorkflowEstimateDto } from "./workflow-estimate-dto";

interface LocaleEstimateDto {
    totalWordCount: number;
    totalWeightedWordCount: number;
    // Nullable per the real LocaleEstimate entity (Integer, unlike the primitive-int word-count
    // fields), with no null-correcting fallback in LocaleEstimateConverter.
    totalCharacterCount: number | null;
    totalPageCount: number | null;
    localeId: string;
    localeDescription: string;
    workflowEstimates: Array<WorkflowEstimateDto>;
    priceInformation: PriceInformationDto | null;
}

export { LocaleEstimateDto };
