import { BindingFilterParameters } from "./binding-filter-parameters";

export class ListBindingsParameters extends BindingFilterParameters {
    private offset?: string;

    setOffset(offset: string): ListBindingsParameters {
        this.offset = offset;

        return this;
    }

    getOffset(): string | undefined {
        return this.offset;
    }
}
