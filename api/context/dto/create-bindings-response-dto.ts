import { BindingDetailsDto } from "./binding/binding-details-dto";
import { SmartlingListResponse } from "../../http/smartling-list-response";

interface CreateBindingsResponseDto {
    created: SmartlingListResponse<BindingDetailsDto>;
    errors: SmartlingListResponse<{ message: string }>;
}

export { CreateBindingsResponseDto };
