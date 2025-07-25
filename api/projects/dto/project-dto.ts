import { LocaleDto } from "./locale-dto";
import { ProjectWithoutTargetLocalesDto } from "./project-without-target-locales-dto";

interface ProjectDto extends ProjectWithoutTargetLocalesDto {
    targetLocales: Array<LocaleDto>;
}

export { ProjectDto };
