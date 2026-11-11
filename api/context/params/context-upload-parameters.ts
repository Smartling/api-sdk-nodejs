import { BaseParameters } from "../../parameters/index";

export class ContextUploadParameters extends BaseParameters {
    setName(name: string): this {
        this.set("name", name);

        return this;
    }

    setContent(content: string): this {
        this.set("content", content);

        return this;
    }
}
