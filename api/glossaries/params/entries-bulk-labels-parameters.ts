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
        this.parameters.filter.query = query;

        return this;
    }

    setFilterLocaleIds(localeIds: Array<string>): EntriesBulkLabelsParameters {
        this.parameters.filter.localeIds = localeIds;

        return this;
    }

    setFilterEntryUids(entryUids: Array<string>): EntriesBulkLabelsParameters {
        this.parameters.filter.entryUids = entryUids;

        return this;
    }

    setFilterEntryState(entryState: EntryState): EntriesBulkLabelsParameters {
        this.parameters.filter.entryState = entryState;

        return this;
    }

    setFilterMissingTranslationLocaleId(localeId: string): EntriesBulkLabelsParameters {
        this.parameters.filter.missingTranslationLocaleId = localeId;

        return this;
    }

    setFilterPresentTranslationLocaleId(localeId: string): EntriesBulkLabelsParameters {
        this.parameters.filter.presentTranslationLocaleId = localeId;

        return this;
    }

    setFilterDntLocaleId(localeId: string): EntriesBulkLabelsParameters {
        this.parameters.filter.dntLocaleId = localeId;

        return this;
    }

    setFilterReturnFallbackTranslations(returnFallback: boolean): EntriesBulkLabelsParameters {
        this.parameters.filter.returnFallbackTranslations = returnFallback;

        return this;
    }

    setFilterLabels(labels: LabelTypeDto): EntriesBulkLabelsParameters {
        this.parameters.filter.labels = labels;

        return this;
    }

    setFilterDntTermSet(dntTermSet: boolean): EntriesBulkLabelsParameters {
        this.parameters.filter.dntTermSet = dntTermSet;

        return this;
    }

    setFilterCreated(created: DateFilterDto): EntriesBulkLabelsParameters {
        this.parameters.filter.created = created;

        return this;
    }

    setFilterLastModified(lastModified: DateFilterDto): EntriesBulkLabelsParameters {
        this.parameters.filter.lastModified = lastModified;

        return this;
    }

    setFilterCreatedBy(createdBy: UserFilterDto): EntriesBulkLabelsParameters {
        this.parameters.filter.createdBy = createdBy;

        return this;
    }

    setFilterLastModifiedBy(lastModifiedBy: UserFilterDto): EntriesBulkLabelsParameters {
        this.parameters.filter.lastModifiedBy = lastModifiedBy;

        return this;
    }

    setFilterPaging(paging: PaginationDto): EntriesBulkLabelsParameters {
        this.parameters.filter.paging = paging;

        return this;
    }

    setFilterSorting(sorting: EntrySortingDto): EntriesBulkLabelsParameters {
        this.parameters.filter.sorting = sorting;

        return this;
    }

    setLabelUids(labelUids: Array<string>): EntriesBulkLabelsParameters {
        this.set("labelUids", labelUids);

        return this;
    }
}
