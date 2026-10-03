import { BaseParameters } from "../../parameters/index";
import { ExportEntriesFilterDto } from "../dto/export-entries-filter-dto";
import { EntryState } from "../enums/entry-state";
import { LabelTypeDto } from "../dto/label-type-dto";
import { DateFilterDto } from "../dto/date-filter-dto";
import { UserFilterDto } from "../dto/user-filter-dto";
import { PaginationDto } from "../dto/pagination-dto";
import { EntrySortingDto } from "../dto/entry-sorting-dto";

export class EntriesBulkLabelsParameters extends BaseParameters {
    constructor() {
        super();
        this.set("filter", {});
    }

    setFilter(filter: ExportEntriesFilterDto): EntriesBulkLabelsParameters {
        this.set("filter", filter);

        return this;
    }

    setFilterQuery(query: string): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.query = query;
        this.set("filter", filter);

        return this;
    }

    setFilterLocaleIds(localeIds: Array<string>): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.localeIds = localeIds;
        this.set("filter", filter);

        return this;
    }

    setFilterEntryUids(entryUids: Array<string>): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.entryUids = entryUids;
        this.set("filter", filter);

        return this;
    }

    setFilterEntryState(entryState: EntryState): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.entryState = entryState;
        this.set("filter", filter);

        return this;
    }

    setFilterMissingTranslationLocaleId(localeId: string): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.missingTranslationLocaleId = localeId;
        this.set("filter", filter);

        return this;
    }

    setFilterPresentTranslationLocaleId(localeId: string): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.presentTranslationLocaleId = localeId;
        this.set("filter", filter);

        return this;
    }

    setFilterDntLocaleId(localeId: string): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.dntLocaleId = localeId;
        this.set("filter", filter);

        return this;
    }

    setFilterReturnFallbackTranslations(returnFallback: boolean): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.returnFallbackTranslations = returnFallback;
        this.set("filter", filter);

        return this;
    }

    setFilterLabels(labels: LabelTypeDto): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.labels = labels;
        this.set("filter", filter);

        return this;
    }

    setFilterDntTermSet(dntTermSet: boolean): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.dntTermSet = dntTermSet;
        this.set("filter", filter);

        return this;
    }

    setFilterCreated(created: DateFilterDto): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.created = created;
        this.set("filter", filter);

        return this;
    }

    setFilterLastModified(lastModified: DateFilterDto): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.lastModified = lastModified;
        this.set("filter", filter);

        return this;
    }

    setFilterCreatedBy(createdBy: UserFilterDto): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.createdBy = createdBy;
        this.set("filter", filter);

        return this;
    }

    setFilterLastModifiedBy(lastModifiedBy: UserFilterDto): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.lastModifiedBy = lastModifiedBy;
        this.set("filter", filter);

        return this;
    }

    setFilterPaging(paging: PaginationDto): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.paging = paging;
        this.set("filter", filter);

        return this;
    }

    setFilterSorting(sorting: EntrySortingDto): EntriesBulkLabelsParameters {
        const filter = this.parameters.filter || {};
        filter.sorting = sorting;
        this.set("filter", filter);

        return this;
    }

    setLabelUids(labelUids: Array<string>): EntriesBulkLabelsParameters {
        this.set("labelUids", labelUids);

        return this;
    }
}
