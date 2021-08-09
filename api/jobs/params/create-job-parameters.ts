import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

export class CreateJobParameters extends BaseParameters {
    setName(jobName: string): CreateJobParameters {
        if (jobName.length >= 170) {
            throw new SmartlingException("Job name should be less than 170 characters.");
        }

        this.set("jobName", jobName);

        return this;
    }

    setDescription(description: string): CreateJobParameters {
        if (description.length >= 2000) {
            throw new SmartlingException("Job description should be less than 2000 characters.");
        }

        this.set("description", description);

        return this;
    }

    setDueDate(dueDate: Date): CreateJobParameters {
        if (dueDate.getTime() < (new Date()).getTime()) {
            throw new SmartlingException("Job Due Date cannot be in the past.");
        }

        this.set("dueDate", dueDate.toISOString());

        return this;
    }
}
