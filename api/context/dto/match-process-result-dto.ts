import { BindingDetailsDto } from "./binding/binding-details-dto";

interface MatchProcessResultDto {
    contextUid: string;
    checkedStringsCount?: number;
    bindings: Array<BindingDetailsDto>;
}

export { MatchProcessResultDto };
