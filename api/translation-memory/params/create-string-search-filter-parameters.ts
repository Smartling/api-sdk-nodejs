import { BaseParameters } from "../../parameters/index";
import { SearchKeyword } from "./search-keyword";
import { LeverageType } from "./leverage-type";
import { SourceType } from "./source-type";
import { TuTranslationQualityType } from "./tu-translation-quality-type";
import { StringSearchTags } from "./string-search-tags";
import { CreateStringSearchOptions } from "./create-string-search-options";

// Nested GraphQL input shapes in this domain (SearchKeyword, StringSearchTags,
// CreateStringSearchOptions) use optional (`field?:`) rather than nullable (`field: T | null`)
// fields - unlike this domain's response DTOs, which use `field: T | null` throughout. This is
// deliberate, not an inconsistency: omitting an input field from the GraphQL variables payload
// (what an optional TS field lets you do - JSON.stringify drops `undefined` keys) means "don't
// filter on this" to the server, which is a different request than explicitly sending `null`.
export class CreateStringSearchFilterParameters extends BaseParameters {
    setTmUids(tmUids: Array<string>): CreateStringSearchFilterParameters {
        this.set("tmUids", tmUids);

        return this;
    }

    setSourceLocaleIds(sourceLocaleIds: Array<string>): CreateStringSearchFilterParameters {
        this.set("sourceLocaleIds", sourceLocaleIds);

        return this;
    }

    setTranslationLocaleIds(
        translationLocaleIds: Array<string>
    ): CreateStringSearchFilterParameters {
        this.set("translationLocaleIds", translationLocaleIds);

        return this;
    }

    setKeyword(keyword: SearchKeyword): CreateStringSearchFilterParameters {
        this.set("keyword", keyword);

        return this;
    }

    setSourceKeyword(sourceKeyword: SearchKeyword): CreateStringSearchFilterParameters {
        this.set("sourceKeyword", sourceKeyword);

        return this;
    }

    setTranslationKeyword(translationKeyword: SearchKeyword): CreateStringSearchFilterParameters {
        this.set("translationKeyword", translationKeyword);

        return this;
    }

    setLeverageType(leverageType: LeverageType): CreateStringSearchFilterParameters {
        this.set("leverageType", leverageType);

        return this;
    }

    setHashcodes(hashcodes: Array<string>): CreateStringSearchFilterParameters {
        this.set("hashcodes", hashcodes);

        return this;
    }

    setSmtHashcodes(smtHashcodes: Array<string>): CreateStringSearchFilterParameters {
        this.set("smtHashcodes", smtHashcodes);

        return this;
    }

    setTranslatorUids(translatorUids: Array<string>): CreateStringSearchFilterParameters {
        this.set("translatorUids", translatorUids);

        return this;
    }

    setTranslationDateRange(start?: Date, end?: Date): CreateStringSearchFilterParameters {
        this.set("translationDateRangeStart", start);
        this.set("translationDateRangeEnd", end);

        return this;
    }

    setEditorUids(editorUids: Array<string>): CreateStringSearchFilterParameters {
        this.set("editorUids", editorUids);

        return this;
    }

    setEditDateRange(start?: Date, end?: Date): CreateStringSearchFilterParameters {
        this.set("editDateRangeStart", start);
        this.set("editDateRangeEnd", end);

        return this;
    }

    setReviewerUids(reviewerUids: Array<string>): CreateStringSearchFilterParameters {
        this.set("reviewerUids", reviewerUids);

        return this;
    }

    setReviewDateRange(start?: Date, end?: Date): CreateStringSearchFilterParameters {
        this.set("reviewDateRangeStart", start);
        this.set("reviewDateRangeEnd", end);

        return this;
    }

    setAuthorizerUids(authorizerUids: Array<string>): CreateStringSearchFilterParameters {
        this.set("authorizerUids", authorizerUids);

        return this;
    }

    setAuthorizationDateRange(start?: Date, end?: Date): CreateStringSearchFilterParameters {
        this.set("authorizationDateRangeStart", start);
        this.set("authorizationDateRangeEnd", end);

        return this;
    }

    setIngestedDateRange(start?: Date, end?: Date): CreateStringSearchFilterParameters {
        this.set("ingestedDateRangeStart", start);
        this.set("ingestedDateRangeEnd", end);

        return this;
    }

    setVariants(variants: Array<string>): CreateStringSearchFilterParameters {
        this.set("variants", variants);

        return this;
    }

    setProjectUids(projectUids: Array<string>): CreateStringSearchFilterParameters {
        this.set("projectUids", projectUids);

        return this;
    }

    setExternalStep(externalStep: boolean): CreateStringSearchFilterParameters {
        this.set("externalStep", externalStep);

        return this;
    }

    setUrls(urls: Array<string>): CreateStringSearchFilterParameters {
        this.set("urls", urls);

        return this;
    }

    setFileNames(fileNames: Array<string>): CreateStringSearchFilterParameters {
        this.set("fileNames", fileNames);

        return this;
    }

    setKeys(keys: Array<string>): CreateStringSearchFilterParameters {
        this.set("keys", keys);

        return this;
    }

    setDomains(domains: Array<string>): CreateStringSearchFilterParameters {
        this.set("domains", domains);

        return this;
    }

    setTmxFileNames(tmxFileNames: Array<string>): CreateStringSearchFilterParameters {
        this.set("tmxFileNames", tmxFileNames);

        return this;
    }

    setSources(sources: Array<SourceType>): CreateStringSearchFilterParameters {
        this.set("sources", sources);

        return this;
    }

    setTranslationQualities(
        translationQualities: Array<TuTranslationQualityType>
    ): CreateStringSearchFilterParameters {
        this.set("translationQualities", translationQualities);

        return this;
    }

    setFirstTranslatorUids(firstTranslatorUids: Array<string>): CreateStringSearchFilterParameters {
        this.set("firstTranslatorUids", firstTranslatorUids);

        return this;
    }

    // After/Before (rather than this file's usual Start/End) matches the GraphQL schema's
    // own field names for these two filters.
    setLastTranslatedRange(after?: Date, before?: Date): CreateStringSearchFilterParameters {
        this.set("lastTranslatedAfter", after);
        this.set("lastTranslatedBefore", before);

        return this;
    }

    setFirstTranslatedRange(after?: Date, before?: Date): CreateStringSearchFilterParameters {
        this.set("firstTranslatedAfter", after);
        this.set("firstTranslatedBefore", before);

        return this;
    }

    setTags(tags: StringSearchTags): CreateStringSearchFilterParameters {
        this.set("tags", tags);

        return this;
    }

    setOfflineReportUids(offlineReportUids: Array<string>): CreateStringSearchFilterParameters {
        this.set("offlineReportUids", offlineReportUids);

        return this;
    }

    setSearchOptions(searchOptions: CreateStringSearchOptions): CreateStringSearchFilterParameters {
        this.set("searchOptions", searchOptions);

        return this;
    }
}
