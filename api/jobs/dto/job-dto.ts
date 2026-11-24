import { CustomFieldDto } from "./custom-field-dto";
import { BaseJobDto } from "./base-job-dto";
import { IssuesCountsDto } from "./issues-counts-dto";
import { CallbackMethod } from "../params/callback-method";

interface JobDto extends BaseJobDto {
    callbackMethod: CallbackMethod | null;
    callbackUrl: string | null;
    createdByUserUid: string;
    firstAuthorizedDate: string | null;
    firstCompletedDate: string | null;
    issues: IssuesCountsDto | null;
    lastAuthorizedDate: string | null;
    lastCompletedDate: string | null;
    modifiedByUserUid: string;
    modifiedDate: Date;
    rushRequest: boolean;
    customFields: Array<CustomFieldDto>;
}

export { JobDto };
