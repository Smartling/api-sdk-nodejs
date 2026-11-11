import { BaseParameters } from "../../parameters/index";

export class BindingFilterParameters extends BaseParameters {
    setStringHashcodes(stringHashcodes: Array<string>): this {
        this.set("stringHashcodes", stringHashcodes);

        return this;
    }

    setContentFileUri(contentFileUri: string): this {
        this.set("contentFileUri", contentFileUri);

        return this;
    }

    setContextUid(contextUid: string): this {
        this.set("contextUid", contextUid);

        return this;
    }

    setBindingUids(bindingUids: Array<string>): this {
        this.set("bindingUids", bindingUids);

        return this;
    }
}
