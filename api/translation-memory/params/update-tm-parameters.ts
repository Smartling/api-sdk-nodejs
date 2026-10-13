import { BaseParameters } from "../../parameters/index";

export class UpdateTmParameters extends BaseParameters {
    setTmUid(tmUid: string): UpdateTmParameters {
        this.set("tmUid", tmUid);

        return this;
    }

    setName(name: string): UpdateTmParameters {
        this.set("name", name);

        return this;
    }

    // null explicitly clears an existing description, per the real UpdateTm input
    // (description: String, nullable - distinct from simply not calling this setter at all).
    setDescription(description: string | null): UpdateTmParameters {
        this.set("description", description);

        return this;
    }
}
