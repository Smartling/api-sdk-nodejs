import { TranslationRequestStatusDto } from "./translation-request-status-dto";

export interface EntryRequestTranslationStatusDto extends TranslationRequestStatusDto {
    projectId: string;
    hashCode: string;
    jobUid: string;
}
