import { BaseParameters } from "../../parameters/index";

export class SearchJobsParameters extends BaseParameters {
    setFileUris(fileUris: Array<string>): SearchJobsParameters {
        this.set("fileUris", fileUris);

        return this;
    }

    setTranslationJobUids(jobUids: Array<string>): SearchJobsParameters {
        this.set("translationJobUids", jobUids);

        return this;
    }
}
