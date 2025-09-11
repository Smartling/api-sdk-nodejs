import { FilterLevel, DateFilterType, LabelType, SortDirection, SortField, EntryState } from "./export-entries-enums";

export interface LabelTypeDto {
    type: LabelType;
}

export interface DateFilterDto {
    level: FilterLevel;
    date: string;
    type: DateFilterType;
}

export interface UserFilterDto {
    level: FilterLevel;
    userIds: Array<string>;
}

export interface ExportEntriesPaginationDto {
    offset: number;
    limit: number;
}

export interface ExportEntriesSortingDto {
    field: SortField;
    direction: SortDirection;
    localeId: string;
}

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
    paging?: ExportEntriesPaginationDto;
    sorting?: ExportEntriesSortingDto;
}
