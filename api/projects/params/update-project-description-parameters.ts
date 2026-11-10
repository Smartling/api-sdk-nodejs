import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception";

const DESCRIPTION_MAX_LENGTH = 250;

export class UpdateProjectDescriptionParameters extends BaseParameters {
    setDescription(description: string): UpdateProjectDescriptionParameters {
        if (description && description.length > DESCRIPTION_MAX_LENGTH) {
            throw new SmartlingException(`Project description should be less than ${DESCRIPTION_MAX_LENGTH} characters.`);
        }

        this.set("description", description);
        return this;
    }
}
