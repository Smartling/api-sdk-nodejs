import { BindingFilterParameters } from "./binding-filter-parameters";
import { SmartlingException } from "../../exception/index";

export class DeleteBindingsParameters extends BindingFilterParameters {
    // Defense in depth: regardless of what the backend does with an unfiltered request,
    // nothing here should delete every binding in a project by accident.
    export(): Record<string, unknown> {
        const exported = super.export();

        if (Object.keys(exported).length === 0) {
            throw new SmartlingException(
                "At least one filter (stringHashcodes, contentFileUri, contextUid or bindingUids) must be set before deleting bindings"
            );
        }

        return exported;
    }
}
