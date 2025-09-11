export enum ExportFormat {
    CSV = "CSV",
    XLSX = "XLSX",
    TBX = "TBX"
}

export enum TbxVersion {
    TBXcoreStructV02 = "TBXcoreStructV02",
    TBXcoreStructV03 = "TBXcoreStructV03"
}

export enum EntryState {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED",
    BOTH = "BOTH"
}

export enum FilterLevel {
    ENTRY = "ENTRY",
    LOCALE = "LOCALE",
    ANY = "ANY"
}

export enum DateFilterType {
    AFTER = "after",
    BEFORE = "before",
    DATE_RANGE = "date_range",
    EXACT = "exact"
}

export enum LabelType {
    EMPTY = "empty"
}

export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC"
}

export enum SortField {
    TERM = "term"
}
