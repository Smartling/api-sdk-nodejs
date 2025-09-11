import { FilterLevel } from "../enums/filter-level";

export interface UserFilterDto {
    level: FilterLevel;
    userIds: Array<string>;
}
