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
        const filter = this.parameters.filter || {};
        filter.query = query;
        this.set("filter", filter);
        return this;
    }

    setFilterLocaleIds(localeIds: Array<string>): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.localeIds = localeIds;
        this.set("filter", filter);
        return this;
    }

    setFilterEntryUids(entryUids: Array<string>): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.entryUids = entryUids;
        this.set("filter", filter);
        return this;
    }

    setFilterEntryState(entryState: EntryState): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.entryState = entryState;
        this.set("filter", filter);
        return this;
    }

    setFilterMissingTranslationLocaleId(localeId: string): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.missingTranslationLocaleId = localeId;
        this.set("filter", filter);
        return this;
    }

    setFilterPresentTranslationLocaleId(localeId: string): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.presentTranslationLocaleId = localeId;
        this.set("filter", filter);
        return this;
    }

    setFilterDntLocaleId(localeId: string): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.dntLocaleId = localeId;
        this.set("filter", filter);
        return this;
    }

    setFilterReturnFallbackTranslations(returnFallback: boolean): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.returnFallbackTranslations = returnFallback;
        this.set("filter", filter);
        return this;
    }

    setFilterLabels(labels: LabelTypeDto): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.labels = labels;
        this.set("filter", filter);
        return this;
    }

    setFilterDntTermSet(dntTermSet: boolean): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.dntTermSet = dntTermSet;
        this.set("filter", filter);
        return this;
    }

    setFilterCreated(created: DateFilterDto): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.created = created;
        this.set("filter", filter);
        return this;
    }

    setFilterLastModified(lastModified: DateFilterDto): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.lastModified = lastModified;
        this.set("filter", filter);
        return this;
    }

    setFilterCreatedBy(createdBy: UserFilterDto): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.createdBy = createdBy;
        this.set("filter", filter);
        return this;
    }

    setFilterLastModifiedBy(lastModifiedBy: UserFilterDto): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.lastModifiedBy = lastModifiedBy;
        this.set("filter", filter);
        return this;
    }

    setFilterPaging(paging: PaginationDto): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.paging = paging;
        this.set("filter", filter);
        return this;
    }

    setFilterSorting(sorting: EntrySortingDto): ExportEntriesParameters {
        const filter = this.parameters.filter || {};
        filter.sorting = sorting;
        this.set("filter", filter);
        return this;
    }
}
