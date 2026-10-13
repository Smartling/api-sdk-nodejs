import { DuplicateStringDto } from "./duplicate-string-dto";

interface CreateStringSearchResultDto {
    searchUid: string;
    stringCount: number | null;
    wordCount: number | null;
    duplicateStrings: Array<DuplicateStringDto> | null;
    duplicateSearch: boolean | null;
    actionUid: string | null;
    offlineReportUid: string | null;
}

export { CreateStringSearchResultDto };
