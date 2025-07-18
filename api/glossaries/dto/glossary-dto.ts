import { FallbackLocaleDto } from "./fallback-locale-dto";

export interface GlossaryDto {
    glossaryUid: string;
    accountUid: string;
    glossaryName: string;
    description: string;
    verificationMode: boolean;
    archived: boolean;
    createdByUserUid: string;
    modifiedByUserUid: string;
    createdDate: Date;
    modifiedDate: Date;
    localeIds: Array<string>;
    fallbackLocales: Array<FallbackLocaleDto>;
    entriesCount: number;
}
