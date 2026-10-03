import { BaseParameters } from "../../parameters/index";

export class ArchiveGlossariesParameters extends BaseParameters {
    setGlossaryUids(glossaryUids: Array<string>): ArchiveGlossariesParameters {
        this.set("glossaryUids", glossaryUids);

        return this;
    }
}
