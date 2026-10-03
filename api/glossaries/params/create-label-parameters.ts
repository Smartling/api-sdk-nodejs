import { BaseParameters } from "../../parameters/index";

export class CreateLabelParameters extends BaseParameters {
    setLabelText(labelText: string): CreateLabelParameters {
        this.set("labelText", labelText);

        return this;
    }
}
