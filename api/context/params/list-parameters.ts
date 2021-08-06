import { BaseParameters } from "../../parameters/index";
import { ContextType } from "./context-type";

export class ListParameters extends BaseParameters {
    setType(type: ContextType): ListParameters {
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
