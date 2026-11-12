import { BaseParameters } from "../../parameters/index";
import { BindingDto } from "../dto/binding/binding-dto";
import { SmartlingException } from "../../exception/index";

// API-enforced limit on POST /bindings (BindingsApiController.CREATE_BINDINGS_LIMIT).
const MAX_BINDINGS_PER_REQUEST = 150;

export class CreateBindingsParameters extends BaseParameters {
    constructor() {
        super();

        this.set("bindings", []);
    }

    addBinding<T extends BindingDto>(binding: T): CreateBindingsParameters {
        const bindings = this.parameters.bindings.concat(binding);

        if (bindings.length > MAX_BINDINGS_PER_REQUEST) {
            throw new SmartlingException(
                `Cannot create more than ${MAX_BINDINGS_PER_REQUEST} bindings at once, got ${bindings.length}`
            );
        }
        this.parameters.bindings = bindings;

        return this;
    }
}
