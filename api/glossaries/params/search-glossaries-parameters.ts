import { BaseParameters } from "../../parameters/index";
import { PaginationDto } from "../dto/pagination-dto";
import { SortingDto } from "../dto/sorting-dto";

export class SearchGlossariesParameters extends BaseParameters {
    setQuery(query: string): SearchGlossariesParameters {
        this.set("query", query);

        return this;
    }

    setGlossaryState(glossaryState: "ACTIVE" | "ARCHIVED" | "BOTH"): SearchGlossariesParameters {
        this.set("glossaryState", glossaryState);

        return this;
    }

    setTargetLocaleId(targetLocaleId: string): SearchGlossariesParameters {
        this.set("targetLocaleId", targetLocaleId);

        return this;
    }

    setGlossaryUids(glossaryUids: Array<string>): SearchGlossariesParameters {
        this.set("glossaryUids", glossaryUids);

        return this;
    }

    setPaging(paging: PaginationDto): SearchGlossariesParameters {
        this.set("paging", paging);

        return this;
    }

    setSorting(sorting: SortingDto): SearchGlossariesParameters {
        this.set("sorting", sorting);

        return this;
    }

    setIncludeEntriesCount(includeEntriesCount: boolean): SearchGlossariesParameters {
        this.set("includeEntriesCount", includeEntriesCount);

        return this;
    }
}
