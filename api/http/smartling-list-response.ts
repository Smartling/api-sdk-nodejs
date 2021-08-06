import { SmartlingBaseResponse } from "./smartling-base-response";

interface SmartlingListResponse<T> extends SmartlingBaseResponse {
    totalCount: number;
    items: Array<T>;
}

export { SmartlingListResponse };
