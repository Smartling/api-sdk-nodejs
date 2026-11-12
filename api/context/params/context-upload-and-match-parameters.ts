import { ContextUploadParameters } from "./context-upload-parameters";
import { VideoMatchingMode } from "./video-matching-mode";
import { SmartlingException } from "../../exception/index";

export class ContextUploadAndMatchParameters extends ContextUploadParameters {
    setFileUri(contentFileUri: string): this {
        this.setMatchParam("contentFileUri", contentFileUri);

        return this;
    }

    setStringHashcodes(stringHashcodes: Array<string>): this {
        this.setMatchParam("stringHashcodes", stringHashcodes);

        return this;
    }

    setTranslationJobUid(translationJobUid: string): this {
        this.setMatchParam("translationJobUids", [translationJobUid]);

        return this;
    }

    setOverrideContextOlderThanDays(days: number): this {
        if (!Number.isInteger(days) || days < 0) {
            throw new SmartlingException("Override context older than days should be a non-negative integer");
        }
        this.setMatchParam("overrideContextOlderThanDays", days);

        return this;
    }

    setVideoMatchingMode(videoMatchingMode: VideoMatchingMode): this {
        this.setMatchParam("videoMatchingMode", videoMatchingMode);

        return this;
    }

    private setMatchParam(key: string, value: unknown): void {
        this.parameters.matchParams = { ...this.parameters.matchParams, [key]: value };
    }
}
