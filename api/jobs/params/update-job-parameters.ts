import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

interface CustomFieldBasicRequest {
    fieldUid: string,
    fieldValue: string
}

export { CustomFieldBasicRequest };

export class UpdateJobParameters extends BaseParameters {
    setName(jobName: string): UpdateJobParameters {
        if (jobName.length >= 170) {
            throw new SmartlingException("Job name should be less than 170 characters.");
        }

        this.set("jobName", jobName);

        return this;
    }

    setDescription(description: string | null): UpdateJobParameters {
        if (description && (description.length >= 2000)) {
            throw new SmartlingException("Job description should be less than 2000 characters.");
        }

        this.set("description", description);

        return this;
    }

    setDueDate(dueDate: Date | null): UpdateJobParameters {
        if (dueDate && (dueDate.getTime() < (new Date()).getTime())) {
            throw new SmartlingException("Job Due Date cannot be in the past.");
        }

        this.set("dueDate", dueDate ? dueDate.toISOString() : null);

        return this;
    }

    setReferenceNumber(referenceNumber: string | null): UpdateJobParameters {
        this.set("referenceNumber", referenceNumber);

        return this;
    }

    setCallbackUrl(callbackUrl: string | null): UpdateJobParameters {
        if (callbackUrl && (callbackUrl.length > 8192)) {
            throw new SmartlingException("Job callback URL should be not greater than 8192 characters.");
        }

        this.set("callbackUrl", callbackUrl);

        return this;
    }

    setCallbackMethod(callbackMethod: string | null): UpdateJobParameters {
        this.set("callbackMethod", callbackMethod);

        return this;
    }

    setCustomFields(customFields: CustomFieldBasicRequest[]): UpdateJobParameters {
        this.set("customFields", customFields);

        return this;
    }
}
