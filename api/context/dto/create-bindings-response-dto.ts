import { BindingDetailsDto } from "./binding/binding-details-dto";

interface CreateBindingsResponseDto {
    created: { items: Array<BindingDetailsDto> } | null;
    errors: {
        totalCount: number;
        items: Array<unknown>;
    };
}

export { CreateBindingsResponseDto };
