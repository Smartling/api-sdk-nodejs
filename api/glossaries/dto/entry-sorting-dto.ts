import { SortField } from "../enums/sort-field";
import { SortDirection } from "../enums/sort-direction";

export interface EntrySortingDto {
    field: SortField;
    direction: SortDirection;
    localeId?: string;
}
