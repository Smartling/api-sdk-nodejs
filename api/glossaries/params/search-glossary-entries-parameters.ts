import { BaseParameters } from "../../parameters/index";
import { EntryState } from "../enums/entry-state";
import { LabelTypeDto } from "../dto/label-type-dto";
import { DateFilterDto } from "../dto/date-filter-dto";
import { UserFilterDto } from "../dto/user-filter-dto";
import { PaginationDto } from "../dto/pagination-dto";
import { EntrySortingDto } from "../dto/entry-sorting-dto";

export class SearchGlossaryEntriesParameters extends BaseParameters {
    setQuery(query: string): SearchGlossaryEntriesParameters {
        this.set("query", query);

        return this;
    }

    setLocaleIds(localeIds: Array<string>): SearchGlossaryEntriesParameters {
        this.set("localeIds", localeIds);

        return this;
    }

    setEntryUids(entryUids: Array<string>): SearchGlossaryEntriesParameters {
        this.set("entryUids", entryUids);

        return this;
    }

    setEntryState(entryState: EntryState): SearchGlossaryEntriesParameters {
        this.set("entryState", entryState);

        return this;
    }

    setMissingTranslationLocaleId(localeId: string): SearchGlossaryEntriesParameters {
        this.set("missingTranslationLocaleId", localeId);

        return this;
    }

    setPresentTranslationLocaleId(localeId: string): SearchGlossaryEntriesParameters {
        this.set("presentTranslationLocaleId", localeId);

        return this;
    }

    setDntLocaleId(localeId: string): SearchGlossaryEntriesParameters {
        this.set("dntLocaleId", localeId);

        return this;
    }

    setReturnFallbackTranslations(returnFallback: boolean): SearchGlossaryEntriesParameters {
        this.set("returnFallbackTranslations", returnFallback);

        return this;
    }

    setLabels(labels: LabelTypeDto): SearchGlossaryEntriesParameters {
        this.set("labels", labels);

        return this;
    }

    setDntTermSet(dntTermSet: boolean): SearchGlossaryEntriesParameters {
        this.set("dntTermSet", dntTermSet);

        return this;
    }

    setCreated(created: DateFilterDto): SearchGlossaryEntriesParameters {
        this.set("created", created);

        return this;
    }

    setLastModified(lastModified: DateFilterDto): SearchGlossaryEntriesParameters {
        this.set("lastModified", lastModified);

        return this;
    }

    setCreatedBy(createdBy: UserFilterDto): SearchGlossaryEntriesParameters {
        this.set("createdBy", createdBy);

        return this;
    }

    setLastModifiedBy(lastModifiedBy: UserFilterDto): SearchGlossaryEntriesParameters {
        this.set("lastModifiedBy", lastModifiedBy);

        return this;
    }

    setPaging(paging: PaginationDto): SearchGlossaryEntriesParameters {
        this.set("paging", paging);

        return this;
    }

    setSorting(sorting: EntrySortingDto): SearchGlossaryEntriesParameters {
        this.set("sorting", sorting);

        return this;
    }
}
