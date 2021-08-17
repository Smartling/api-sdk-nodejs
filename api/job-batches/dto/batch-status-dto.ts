import { BatchStatus } from "../params/batch-status";
import { BatchItemDto } from "./batch-item-dto";

interface BatchStatusDto {
    status: BatchStatus;
    authorized: boolean;
    generalErrors: string;
    projectId: string;
    translationJobUid: string;
    updatedDate: Date;
    files: Array<BatchItemDto>;
}

export { BatchStatusDto };
