import { DuplicateStringDto } from "./duplicate-string-dto";

interface CreateStringSearchResultDto {
    searchUid: string;
    stringCount: number | null;
    wordCount: number | null;
    duplicateStrings: Array<DuplicateStringDto> | null;
    duplicateSearch: boolean | null;
    // UID of the async action tracking search indexing, only present if indexing continues in
    // the background - distinct from AsyncActionResultDto.actionUid (a bulk operation's own
    // tracking UID, always present once that operation has started).
    actionUid: string | null;
    offlineReportUid: string | null;
}

export { CreateStringSearchResultDto };
