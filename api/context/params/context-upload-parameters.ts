import { BaseParameters } from "../../parameters/index";

export class ContextUploadParameters extends BaseParameters {
    setName(name: string): ContextUploadParameters {
        this.set("name", name);

        return this;
    }

    setContent(content: string): ContextUploadParameters {
        this.set("content", content);

        return this;
    }
}
