import { AsyncActionStatus } from "./async-action-status";

interface AsyncActionResultDto {
    actionUid: string;
    totalCount: number;
    processedCount: number;
    errorCount: number;
    executionComplete: boolean;
    actionStatus: AsyncActionStatus;
}

export { AsyncActionResultDto };
