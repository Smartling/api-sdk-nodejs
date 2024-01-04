import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";
import { CallbackMethod } from "./callback-method";

interface CustomFieldBasicRequest {
    fieldUid: string,
    fieldValue: string
}

export abstract class CreateUpdateJobBaseParameters<T extends CreateUpdateJobBaseParameters<T>>
    extends BaseParameters {
    setName(jobName: string): T {
        if (jobName.length >= 170) {
            throw new SmartlingException("Job name should be less than 170 characters.");
        }

        this.set("jobName", jobName);

        return this as unknown as T;
    }

    setDescription(description: string | null): T {
        if (description && (description.length >= 2000)) {
            throw new SmartlingException("Job description should be less than 2000 characters.");
        }

        this.set("description", description);

        return this as unknown as T;
    }

    setDueDate(dueDate: Date | null): T {
        if (dueDate && (dueDate.getTime() < (new Date()).getTime())) {
            throw new SmartlingException("Job Due Date cannot be in the past.");
        }

        this.set("dueDate", dueDate ? dueDate.toISOString() : null);

        return this as unknown as T;
    }

    setReferenceNumber(referenceNumber: string | null): T {
        this.set("referenceNumber", referenceNumber);

        return this as unknown as T;
    }

    setCallbackUrl(callbackUrl: string | null): T {
        if (callbackUrl && (callbackUrl.length > 8192)) {
            throw new SmartlingException("Job callback URL should be not greater than 8192 characters.");
        }

        this.set("callbackUrl", callbackUrl);

        return this as unknown as T;
    }

    setCallbackMethod(callbackMethod: CallbackMethod | null): T {
        this.set("callbackMethod", callbackMethod);

        return this as unknown as T;
    }

    setCustomFields(customFields: CustomFieldBasicRequest[]): T {
        this.set("customFields", customFields);

        return this as unknown as T;
    }
}
