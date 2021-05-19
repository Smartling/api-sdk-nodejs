import BaseParameters from "../../parameters";
import { BindingDto } from "../dto/binding/binding-dto";

export class CreateBindingsParameters extends BaseParameters {
    constructor() {
        super();

        this.set("bindings", []);
    }

    addBinding(binding: BindingDto): CreateBindingsParameters {
        this.parameters.bindings.push(binding);

        return this;
    }
}
