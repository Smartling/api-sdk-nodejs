import { PartOfSpeech } from "../enums/part-of-speech";
import { SuggestionStatus } from "../enums/suggestion-status";
import { GlossaryTranslationDto } from "./translation-dto";
import { CustomFieldValueDto } from "./custom-field-value-dto";
import { EntryRequestTranslationStatusDto } from "./entry-request-translation-status-dto";

export interface GlossaryEntryDto {
    entryUid: string;
    glossaryUid: string;
    definition: string;
    partOfSpeech?: PartOfSpeech;
    labelUids: Array<string>;
    translations: Array<GlossaryTranslationDto>;
    customFieldValues: Array<CustomFieldValueDto>;
    archived: boolean;
    createdByUserUid: string;
    modifiedByUserUid: string;
    createdDate: Date;
    modifiedDate: Date;
    requestTranslationStatuses?: Record<string, EntryRequestTranslationStatusDto>;
    suggestionStatus?: SuggestionStatus;
}
