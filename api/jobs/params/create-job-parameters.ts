import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

export class CreateJobParameters extends BaseParameters {
    setName(jobName) {
        if (jobName.length >= 170) {
            throw new SmartlingException("Job name should be less than 170 characters.");
        }

        this.set("jobName", jobName);

        return this;
    }

    setDescription(description) {
        if (description.length >= 2000) {
            throw new SmartlingException("Job description should be less than 2000 characters.");
        }

        this.set("description", description);

        return this;
    }

    setDueDate(dueDate) {
        if (Object.prototype.toString.call(dueDate) !== "[object Date]") {
            throw new SmartlingException("Due date must be an instance of Date");
        }

        if (dueDate.getTime() < (new Date()).getTime()) {
            throw new SmartlingException("Job Due Date cannot be in the past.");
        }

        this.set("dueDate", dueDate.toISOString());

        return this;
    }
}
