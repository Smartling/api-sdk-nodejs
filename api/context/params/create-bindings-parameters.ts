import { BaseParameters } from "../../parameters/index";
import { BindingDto } from "../dto/binding/binding-dto";

export class CreateBindingsParameters extends BaseParameters {
    constructor() {
        super();

        this.set("bindings", []);
    }

    addBinding<T extends BindingDto>(binding: T): CreateBindingsParameters {
        this.parameters.bindings = this.parameters.bindings.concat(binding);

        return this;
    }
}
