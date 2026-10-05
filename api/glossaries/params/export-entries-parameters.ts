import { BaseParameters } from "../../parameters";
import { ExportEntriesFilterDto } from "../dto/export-entries-filter-dto";
import { ExportFormat } from "../enums/export-format";
import { TbxVersion } from "../enums/tbx-version";
import { EntryState } from "../enums/entry-state";
import { LabelTypeDto } from "../dto/label-type-dto";
import { DateFilterDto } from "../dto/date-filter-dto";
import { UserFilterDto } from "../dto/user-filter-dto";
import { PaginationDto } from "../dto/pagination-dto";
import { EntrySortingDto } from "../dto/entry-sorting-dto";

export class ExportEntriesParameters extends BaseParameters {
    constructor() {
        super();
        this.set("filter", {});
        this.set("localeIds", []);
    }

    setFormat(format: ExportFormat): ExportEntriesParameters {
        this.set("format", format);
        return this;
    }

    setTbxVersion(tbxVersion: TbxVersion): ExportEntriesParameters {
        this.set("tbxVersion", tbxVersion);
        return this;
    }

    setFocusLocaleId(focusLocaleId: string): ExportEntriesParameters {
        this.set("focusLocaleId", focusLocaleId);
        return this;
    }

    setLocaleIds(localeIds: Array<string>): ExportEntriesParameters {
        this.set("localeIds", localeIds);
        return this;
    }

    setSkipEntries(skipEntries: boolean): ExportEntriesParameters {
        this.set("skipEntries", skipEntries);
        return this;
    }

    setFilter(filter: ExportEntriesFilterDto): ExportEntriesParameters {
        this.set("filter", filter);
        return this;
    }

    setFilterQuery(query: string): ExportEntriesParameters {
        this.parameters.filter.query = query;
        return this;
    }

    setFilterLocaleIds(localeIds: Array<string>): ExportEntriesParameters {
        this.parameters.filter.localeIds = localeIds;
        return this;
    }

    setFilterEntryUids(entryUids: Array<string>): ExportEntriesParameters {
        this.parameters.filter.entryUids = entryUids;
        return this;
    }

    setFilterEntryState(entryState: EntryState): ExportEntriesParameters {
        this.parameters.filter.entryState = entryState;
        return this;
    }

    setFilterMissingTranslationLocaleId(localeId: string): ExportEntriesParameters {
        this.parameters.filter.missingTranslationLocaleId = localeId;
        return this;
    }

    setFilterPresentTranslationLocaleId(localeId: string): ExportEntriesParameters {
        this.parameters.filter.presentTranslationLocaleId = localeId;
        return this;
    }

    setFilterDntLocaleId(localeId: string): ExportEntriesParameters {
        this.parameters.filter.dntLocaleId = localeId;
        return this;
    }

    setFilterReturnFallbackTranslations(returnFallback: boolean): ExportEntriesParameters {
        this.parameters.filter.returnFallbackTranslations = returnFallback;
        return this;
    }

    setFilterLabels(labels: LabelTypeDto): ExportEntriesParameters {
        this.parameters.filter.labels = labels;
        return this;
    }

    setFilterDntTermSet(dntTermSet: boolean): ExportEntriesParameters {
        this.parameters.filter.dntTermSet = dntTermSet;
        return this;
    }

    setFilterCreated(created: DateFilterDto): ExportEntriesParameters {
        this.parameters.filter.created = created;
        return this;
    }

    setFilterLastModified(lastModified: DateFilterDto): ExportEntriesParameters {
        this.parameters.filter.lastModified = lastModified;
        return this;
    }

    setFilterCreatedBy(createdBy: UserFilterDto): ExportEntriesParameters {
        this.parameters.filter.createdBy = createdBy;
        return this;
    }

    setFilterLastModifiedBy(lastModifiedBy: UserFilterDto): ExportEntriesParameters {
        this.parameters.filter.lastModifiedBy = lastModifiedBy;
        return this;
    }

    setFilterPaging(paging: PaginationDto): ExportEntriesParameters {
        this.parameters.filter.paging = paging;
        return this;
    }

    setFilterSorting(sorting: EntrySortingDto): ExportEntriesParameters {
        this.parameters.filter.sorting = sorting;
        return this;
    }
}
