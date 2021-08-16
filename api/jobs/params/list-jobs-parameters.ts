import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";
import { Order } from "../../parameters/order";
import { JobStatus } from "./job-status";

export class ListJobsParameters extends BaseParameters {
    setName(jobName: string): ListJobsParameters {
        if (jobName.length >= 170) {
            throw new SmartlingException("Job name should be less than 170 characters.");
        }

        this.set("jobName", jobName);

        return this;
    }

    setLimit(limit: number): ListJobsParameters {
        if (limit > 0) {
            this.set("limit", limit);
        }

        return this;
    }

    setOffset(offset: number): ListJobsParameters {
        if (offset >= 0) {
            this.set("offset", offset);
        }

        return this;
    }

    setStatuses(statuses: JobStatus | Array<JobStatus>): ListJobsParameters {
        this.set("translationJobStatus", statuses);

        return this;
    }

    setSort(field: string, order: Order): ListJobsParameters {
        this.set("sortBy", field);
        this.set("sortDirection", order);

        return this;
    }
}
