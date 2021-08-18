import { JobStatus } from "../params/job-status";

interface BaseJobDto {
    createdDate: Date;
    description: string;
    dueDate: Date;
    jobName: string;
    jobNumber: string;
    jobStatus: JobStatus;
    targetLocaleIds: Array<string>;
    translationJobUid: string;
    referenceNumber: string;
}

export { BaseJobDto };
