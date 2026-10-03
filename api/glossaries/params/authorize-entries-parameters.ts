import { BaseParameters } from "../../parameters/index";
import { ExportEntriesFilterDto } from "../dto/export-entries-filter-dto";
import { LocaleWorkflowDto } from "../dto/locale-workflow-dto";

export class AuthorizeEntriesParameters extends BaseParameters {
    setSourceLocale(sourceLocale: string): AuthorizeEntriesParameters {
        this.set("sourceLocale", sourceLocale);

        return this;
    }

    setProjectId(projectId: string): AuthorizeEntriesParameters {
        this.set("projectId", projectId);

        return this;
    }

    setFilter(filter: ExportEntriesFilterDto): AuthorizeEntriesParameters {
        this.set("filter", filter);

        return this;
    }

    setLocaleWorkflows(localeWorkflows: Array<LocaleWorkflowDto>): AuthorizeEntriesParameters {
        this.set("localeWorkflows", localeWorkflows);

        return this;
    }

    setMissingTranslationsOnly(missingTranslationsOnly: boolean): AuthorizeEntriesParameters {
        this.set("missingTranslationsOnly", missingTranslationsOnly);

        return this;
    }
}
