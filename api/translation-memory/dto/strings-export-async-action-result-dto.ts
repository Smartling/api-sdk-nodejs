import { AsyncActionStatus } from "./async-action-status";

interface StringsExportAsyncActionResultDto {
    actionUid: string;
    totalCount: number;
    processedCount: number;
    errorCount: number;
    executionComplete: boolean;
    tmxDownloadKey?: string | null;
    expired: boolean;
    actionStatus: AsyncActionStatus;
}

export { StringsExportAsyncActionResultDto };
