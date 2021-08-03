import { LocaleDto } from "./locale-dto";

interface ProjectDto {
    accountUid: string;
    archived: boolean;
    projectId: string;
    projectName: string;
    projectTypeCode: string;
    sourceLocaleDescription: string;
    sourceLocaleId: string;
    targetLocales: Array<LocaleDto>
}

export { ProjectDto };
