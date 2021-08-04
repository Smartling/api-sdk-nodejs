import { BaseParameters } from "../../parameters/index";

export class CreateBatchParameters extends BaseParameters {
    setTranslationJobUid(uid: string): CreateBatchParameters {
        this.set("translationJobUid", uid);

        return this;
    }

    setAuthorize(authorize: boolean): CreateBatchParameters {
        this.set("authorize", authorize);

        return this;
    }
}
