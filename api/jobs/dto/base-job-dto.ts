import { JobStatus } from "../params/job-status";

interface BaseJobDto {
    createdDate: Date;
    description: string | null;
    dueDate: Date | null;
    jobName: string;
    jobNumber: string | null;
    jobStatus: JobStatus;
    targetLocaleIds: Array<string>;
    translationJobUid: string;
    referenceNumber: string | null;
}

export { BaseJobDto };
