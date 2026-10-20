import { BaseParameters } from "../../parameters/index";
import { JobContentType } from "./job-content-type";
import { LocaleWorkflowPairDto } from "../dto/locale-workflow-pair-dto";
import { LocaleWorkflowStepPairDto } from "../dto/locale-workflow-step-pair-dto";

export class GenerateJobEstimateReportParameters extends BaseParameters {
    setContentType(contentType: JobContentType): GenerateJobEstimateReportParameters {
        this.set("contentType", contentType);

        return this;
    }

    setTags(tags: Array<string>): GenerateJobEstimateReportParameters {
        this.set("tags", tags);

        return this;
    }

    setLocaleWorkflows(
        localeWorkflows: Array<LocaleWorkflowPairDto>
    ): GenerateJobEstimateReportParameters {
        this.set("localeWorkflows", localeWorkflows);

        return this;
    }

    setFuzzyProfileUid(fuzzyProfileUid: string): GenerateJobEstimateReportParameters {
        this.set("fuzzyProfileUid", fuzzyProfileUid);

        return this;
    }

    setRushRequest(rushRequest: boolean): GenerateJobEstimateReportParameters {
        this.set("rushRequest", rushRequest);

        return this;
    }

    setLocaleWorkflowStepsFilter(
        localeWorkflowStepsFilter: Array<LocaleWorkflowStepPairDto>
    ): GenerateJobEstimateReportParameters {
        this.set("localeWorkflowStepsFilter", localeWorkflowStepsFilter);

        return this;
    }
}
