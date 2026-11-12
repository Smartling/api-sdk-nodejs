import { BindingFilterParameters } from "./binding-filter-parameters";
import { SmartlingException } from "../../exception/index";

export class DeleteBindingsParameters extends BindingFilterParameters {
    // An unfiltered request falls through to "all bindings in the project" on the backend
    // (BindingOperationsFactory.getBindingOperations -> getAllBindingsOperation), so nothing
    // here should send one by accident.
    export(): Record<string, unknown> {
        const exported = super.export();

        if (!DeleteBindingsParameters.hasAnyFilterSet(exported)) {
            throw new SmartlingException(
                "At least one filter (stringHashcodes, contentFileUri, contextUid or bindingUids) must be set before deleting bindings"
            );
        }

        return exported;
    }
}
