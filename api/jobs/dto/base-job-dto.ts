import { JobStatus } from "../params/job-status";

interface BaseJobDto {
    createdDate: string;
    description: string;
    dueDate: string;
    jobName: string;
    jobNumber: string;
    jobStatus: JobStatus;
    targetLocaleIds: Array<string>;
    translationJobUid: string;
}

export { BaseJobDto };
