import { FilterLevel } from "../enums/filter-level";
import { DateFilterType } from "../enums/date-filter-type";

export interface DateFilterDto {
    level: FilterLevel;
    type: DateFilterType;
    date?: string;
    from?: string;
    to?: string;
}
