import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";
import { Order } from "./order";

export class ListJobsParameters extends BaseParameters {
    setName(jobName: string) {
        if (jobName.length >= 170) {
            throw new SmartlingException("Job name should be less than 170 characters.");
        }

        this.set("jobName", jobName);

        return this;
    }

    setLimit(limit: number) {
        if (limit > 0) {
            this.set("limit", limit);
        }

        return this;
    }

    setOffset(offset: number) {
        if (offset > 0) {
            this.set("offset", offset);
        }

        return this;
    }

    setStatuses(statuses: string | Array<string>) {
        this.set("translationJobStatus", statuses);

        return this;
    }

    setSort(field: string, order: Order) {
        this.set("sortBy", field);
        this.set("sortDirection", order);

        return this;
    }
}
