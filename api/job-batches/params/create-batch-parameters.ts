import { BaseParameters } from "../../parameters";

export class CreateBatchParameters extends BaseParameters {
    setTranslationJobUid(uid) {
        this.set("translationJobUid", uid);

        return this;
    }

    setAuthorize(authorize) {
        this.set("authorize", authorize);

        return this;
    }
}
