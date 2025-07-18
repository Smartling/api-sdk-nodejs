import { LocaleDto } from "./locale-dto";

interface ProjectWithoutTargetLocalesDto {
    accountUid: string;
    archived: boolean;
    projectId: string;
    projectName: string;
    projectTypeCode: string;
    sourceLocaleDescription: string;
    sourceLocaleId: string;
    projectTypeDisplayValue: string;
    packageUid: string;
}

export { ProjectWithoutTargetLocalesDto };
