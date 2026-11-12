import { LocaleMappingLevel } from "./locale-mapping-level";

interface LocaleMappingDto {
    localeMappingUid: string;
    externalLocaleId: string;
    externalLocaleDescription: string | null;
    externalLocaleMetadata: Record<string, unknown> | null;
    smartlingLocaleId: string;
    mappingLevel: LocaleMappingLevel;
    accountUid: string;
    projectId: string | null;
    integrationId: string;
    created: Date;
    modified: Date;
}

export { LocaleMappingDto };
