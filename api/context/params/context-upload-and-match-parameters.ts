import { ContextUploadParameters } from "./context-upload-parameters";
import { VideoMatchingMode } from "./video-matching-mode";
import { SmartlingException } from "../../exception/index";

export class ContextUploadAndMatchParameters extends ContextUploadParameters {
    setFileUri(contentFileUri: string): ContextUploadAndMatchParameters {
        this.setMatchParam("contentFileUri", contentFileUri);

        return this;
    }

    setStringHashcodes(stringHashcodes: Array<string>): ContextUploadAndMatchParameters {
        this.setMatchParam("stringHashcodes", stringHashcodes);

        return this;
    }

    setTranslationJobUids(translationJobUids: Array<string>): ContextUploadAndMatchParameters {
        if (translationJobUids.length > 1) {
            throw new SmartlingException("Only one translation job uid is supported");
        }
        this.setMatchParam("translationJobUids", translationJobUids);

        return this;
    }

    setOverrideContextOlderThanDays(days: number): ContextUploadAndMatchParameters {
        if (days < 1) {
            throw new SmartlingException("Override context older than days should be a positive number");
        }
        this.setMatchParam("overrideContextOlderThanDays", days);

        return this;
    }

    setVideoMatchingMode(videoMatchingMode: VideoMatchingMode): ContextUploadAndMatchParameters {
        this.setMatchParam("videoMatchingMode", videoMatchingMode);

        return this;
    }

    private setMatchParam(key: string, value: unknown): void {
        this.parameters.matchParams = { ...this.parameters.matchParams, [key]: value };
    }
}
