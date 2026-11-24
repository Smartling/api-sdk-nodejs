import { BaseJobDto } from "./base-job-dto";

interface JobListItemDto extends BaseJobDto {
    rushRequest: boolean;
}

export { JobListItemDto };
