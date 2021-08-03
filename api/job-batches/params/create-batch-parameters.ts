import { BaseParameters } from "../../parameters/index";

export class CreateBatchParameters extends BaseParameters {
    setTranslationJobUid(uid: string) {
        this.set("translationJobUid", uid);

        return this;
    }

    setAuthorize(authorize: boolean) {
        this.set("authorize", authorize);

        return this;
    }
}
