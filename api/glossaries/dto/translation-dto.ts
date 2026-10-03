import { CustomFieldValueDto } from "./custom-field-value-dto";
import { TranslationRequestStatusDto } from "./translation-request-status-dto";

export interface TranslationDto {
    localeId: string;
    fallbackLocaleId?: string;
    term: string;
    notes?: string;
    caseSensitive?: boolean;
    exactMatch?: boolean;
    doNotTranslate?: boolean;
    disabled?: boolean;
    variants?: Array<string>;
    customFieldValues?: Array<CustomFieldValueDto>;
    requestTranslationStatus?: TranslationRequestStatusDto;
    createdByUserUid?: string;
    modifiedByUserUid?: string;
    createdDate?: Date;
    modifiedDate?: Date;
}
