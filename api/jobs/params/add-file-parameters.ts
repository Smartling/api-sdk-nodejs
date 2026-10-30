import { BaseParameters } from "../../parameters/index";

export class AddFileParameters extends BaseParameters {
    setFileUri(fileUri: string): AddFileParameters {
        this.set("fileUri", fileUri);

        return this;
    }

    setTargetLocaleIds(targetLocaleIds: string[]): AddFileParameters {
        this.set("targetLocaleIds", targetLocaleIds);

        return this;
    }

    setMoveEnabled(moveEnabled: boolean): AddFileParameters {
        this.set("moveEnabled", moveEnabled);

        return this;
    }
}
