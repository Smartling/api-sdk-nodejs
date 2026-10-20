import { BaseParameters } from "../../parameters/index";
import { EstimateReportStatus } from "./estimate-report-status";
import { EstimateReportContentCoverage } from "./estimate-report-content-coverage";
import { JobContentType } from "./job-content-type";

export class ListJobEstimateReportsParameters extends BaseParameters {
    setReportStatus(reportStatus: EstimateReportStatus): ListJobEstimateReportsParameters {
        this.set("reportStatus", reportStatus);

        return this;
    }

    setContentCoverage(
        contentCoverage: EstimateReportContentCoverage
    ): ListJobEstimateReportsParameters {
        this.set("contentCoverage", contentCoverage);

        return this;
    }

    setCreatorUserUids(creatorUserUids: Array<string>): ListJobEstimateReportsParameters {
        this.set("creatorUserUids", creatorUserUids);

        return this;
    }

    setTranslationJobSchemaContents(
        translationJobSchemaContents: Array<JobContentType>
    ): ListJobEstimateReportsParameters {
        this.set("translationJobSchemaContents", translationJobSchemaContents);

        return this;
    }

    setTags(tags: Array<string>): ListJobEstimateReportsParameters {
        this.set("tags", tags);

        return this;
    }

    setCreatedFrom(createdFrom: Date): ListJobEstimateReportsParameters {
        this.set("createdFrom", `${createdFrom.toISOString().split(".")[0]}Z`);

        return this;
    }

    setCreatedTo(createdTo: Date): ListJobEstimateReportsParameters {
        this.set("createdTo", `${createdTo.toISOString().split(".")[0]}Z`);

        return this;
    }

    setLimit(limit: number): ListJobEstimateReportsParameters {
        this.set("limit", limit);

        return this;
    }

    setOffset(offset: number): ListJobEstimateReportsParameters {
        this.set("offset", offset);

        return this;
    }
}
