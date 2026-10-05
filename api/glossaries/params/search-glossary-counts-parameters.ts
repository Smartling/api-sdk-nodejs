import { BaseParameters } from "../../parameters/index";
import { PaginationDto } from "../dto/pagination-dto";
import { SortingDto } from "../dto/sorting-dto";

export class SearchGlossaryCountsParameters extends BaseParameters {
    setQuery(query: string): SearchGlossaryCountsParameters {
        this.set("query", query);

        return this;
    }

    setGlossaryState(glossaryState: "ACTIVE" | "ARCHIVED" | "BOTH"): SearchGlossaryCountsParameters {
        this.set("glossaryState", glossaryState);

        return this;
    }

    setTargetLocaleId(targetLocaleId: string): SearchGlossaryCountsParameters {
        this.set("targetLocaleId", targetLocaleId);

        return this;
    }

    setGlossaryUids(glossaryUids: Array<string>): SearchGlossaryCountsParameters {
        this.set("glossaryUids", glossaryUids);

        return this;
    }

    setPaging(paging: PaginationDto): SearchGlossaryCountsParameters {
        this.set("paging", paging);

        return this;
    }

    setSorting(sorting: SortingDto): SearchGlossaryCountsParameters {
        this.set("sorting", sorting);

        return this;
    }
}
