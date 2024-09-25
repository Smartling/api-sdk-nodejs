import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";
import { CallbackMethod } from "./callback-method";

interface CustomFieldBasicRequest {
    fieldUid: string,
    fieldValue: string
}

export class JobParameters extends BaseParameters {
    setName(jobName: string): this {
        if (jobName.length >= 170) {
            throw new SmartlingException("Job name should be less than 170 characters.");
        }

        this.set("jobName", jobName);

        return this;
    }

    setDescription(description: string | null): this {
        if (description && (description.length >= 2000)) {
            throw new SmartlingException("Job description should be less than 2000 characters.");
        }

        this.set("description", description);

        return this;
    }

    setDueDate(dueDate: Date | null): this {
        this.set("dueDate", dueDate ? dueDate.toISOString() : null);

        return this;
    }

    setReferenceNumber(referenceNumber: string | null): this {
        this.set("referenceNumber", referenceNumber);

        return this;
    }

    setCallbackUrl(callbackUrl: string | null): this {
        if (callbackUrl && (callbackUrl.length > 8192)) {
            throw new SmartlingException("Job callback URL should be not greater than 8192 characters.");
        }

        this.set("callbackUrl", callbackUrl);

        return this;
    }

    setCallbackMethod(callbackMethod: CallbackMethod | null): this {
        this.set("callbackMethod", callbackMethod);

        return this;
    }

    setCustomFields(customFields: CustomFieldBasicRequest[]): this {
        this.set("customFields", customFields);

        return this;
    }
}
