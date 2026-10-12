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

    setDescription(description: string): UpdateTmParameters {
        this.set("description", description);

        return this;
    }
}
