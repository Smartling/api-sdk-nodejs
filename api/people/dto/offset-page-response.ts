import { SmartlingBareListResponse } from "../../http/smartling-bare-list-response";

interface OffsetPageResponse<T> extends SmartlingBareListResponse<T> {
    offsetToken: string | null;
}

export { OffsetPageResponse };
