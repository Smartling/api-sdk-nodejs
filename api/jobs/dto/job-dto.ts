import { CustomFieldDto } from "./custom-field-dto";
import { BaseJobDto } from "./base-job-dto";

interface JobDto extends BaseJobDto {
    callbackMethod: string;
    callbackUrl: string;
    createdByUserUid: string;
    firstCompletedDate: string;
    lastCompletedDate: string;
    modifiedByUserUid: string;
    modifiedDate: string;
    customFields: Array<CustomFieldDto>;
}

export { JobDto };
