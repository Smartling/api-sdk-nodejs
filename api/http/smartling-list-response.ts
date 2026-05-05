import { SmartlingBareListResponse } from "./smartling-bare-list-response";

interface SmartlingListResponse<T> extends SmartlingBareListResponse<T> {
    totalCount: number;
}

export { SmartlingListResponse };
