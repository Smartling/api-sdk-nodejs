import BaseParameters from "../../parameters";
import { Asset } from "../models/asset";

export class RequestTranslation extends BaseParameters {
    constructor() {
        super();
    }

    public setLocaleIds(localeIds: string[]): this {
        this.set("localeIds", localeIds);

        return this;
    };

    public setTranslationJobUid(translationJobUid: string): this {
        this.set("translationJobUid", translationJobUid);

        return this;
    };

    public setBulkActionUid(bulkActionUid: string): this {
        this.set("bulkActionUid", bulkActionUid);

        return this;
    };

    public setAuthorize(authorize: boolean): this {
        this.set("authorize", authorize);

        return this;
    }

    public setAssets(assets: Asset[]): this {
        this.set("assets", assets);

        return this;
    }
}
