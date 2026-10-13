import { KeywordSearchType } from "./keyword-search-type";

interface SearchKeyword {
    searchText: string;
    caseSensitive?: boolean;
    entireStringMatch?: boolean;
    searchType?: KeywordSearchType;
}

export { SearchKeyword };
