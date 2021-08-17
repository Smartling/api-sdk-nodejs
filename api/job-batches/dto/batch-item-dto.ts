import { BatchItemStatus } from "../params/batch-item-status";
import { BatchLocaleDto } from "./batch-locale-dto";

interface BatchItemDto {
    errors: string;
    fileUri: string;
    status: BatchItemStatus;
    targetLocales: Array<BatchLocaleDto>;
    updatedDate: Date;
}

export { BatchItemDto };
