import { BatchStatus } from "../params/batch-status";
import { BatchDto } from "./batch-dto";

interface BatchListItemDto extends BatchDto {
    status: BatchStatus;
    authorized: boolean;
    translationJobUid: string;
    projectId: string;
    createdDate: Date
    modifiedDate: Date

}

export { BatchListItemDto };
