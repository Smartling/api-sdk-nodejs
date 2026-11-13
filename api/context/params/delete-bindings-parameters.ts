import { BindingFilterParameters } from "./binding-filter-parameters";
import { SmartlingException } from "../../exception/index";

export class DeleteBindingsParameters extends BindingFilterParameters {
    // An unfiltered request deletes every binding in the project, so nothing here should
    // send one by accident.
    export(): Record<string, unknown> {
        const exported = super.export();

        if (!DeleteBindingsParameters.hasAnyFilterSet(exported)) {
            throw new SmartlingException(
                `At least one filter (${DeleteBindingsParameters.describeFilterKeys()}) must be set before deleting bindings`
            );
        }

        return exported;
    }
}
