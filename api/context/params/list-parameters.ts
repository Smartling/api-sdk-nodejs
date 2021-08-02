import BaseParameters from "../../parameters";
import { ContextTypeEnum } from "./context-type-enum";

export class ListParameters extends BaseParameters {
    setType(type: ContextTypeEnum): ListParameters {
        this.set("type", type);

        return this;
    }

    setOffset(offset: string): ListParameters {
        this.set("offset", offset);

        return this;
    }

    setNameFilter(nameFilter: string): ListParameters {
        this.set("nameFilter", nameFilter);

        return this;
    }
}
