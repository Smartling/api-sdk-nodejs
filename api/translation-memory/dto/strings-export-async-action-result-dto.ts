import { AsyncActionResultDto } from "./async-action-result-dto";

interface StringsExportAsyncActionResultDto extends AsyncActionResultDto {
    tmxDownloadKey: string | null;
    expired: boolean;
}

export { StringsExportAsyncActionResultDto };
