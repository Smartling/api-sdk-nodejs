import { JobFilterPresence } from "../enums/job-filter-presence";

export interface JobFilterDto {
    jobUids?: Array<string>;
    presence?: JobFilterPresence;
}
