import { CustomFieldDto } from "./custom-field-dto";
import { BaseJobDto } from "./base-job-dto";
import { CallbackMethod } from "../params/callback-method";

interface JobDto extends BaseJobDto {
    callbackMethod: CallbackMethod;
    callbackUrl: string;
    createdByUserUid: string;
    firstCompletedDate: string;
    lastCompletedDate: string;
    modifiedByUserUid: string;
    modifiedDate: Date;
    customFields: Array<CustomFieldDto>;
}

export { JobDto };
