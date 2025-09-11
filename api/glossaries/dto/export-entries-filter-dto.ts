import { EntryState } from "../enums/entry-state";
import { LabelTypeDto } from "./label-type-dto";
import { DateFilterDto } from "./date-filter-dto";
import { UserFilterDto } from "./user-filter-dto";
import { PaginationDto } from "./pagination-dto";
import { EntrySortingDto } from "./entry-sorting-dto";

export interface ExportEntriesFilterDto {
    query?: string;
    localeIds?: Array<string>;
    entryUids?: Array<string>;
    entryState?: EntryState;
    missingTranslationLocaleId?: string;
    presentTranslationLocaleId?: string;
    dntLocaleId?: string;
    returnFallbackTranslations?: boolean;
    labels?: LabelTypeDto;
    dntTermSet?: boolean;
    created?: DateFilterDto;
    lastModified?: DateFilterDto;
    createdBy?: UserFilterDto;
    lastModifiedBy?: UserFilterDto;
    paging?: PaginationDto;
    sorting?: EntrySortingDto;
}
