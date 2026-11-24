import { SmartlingBareListResponse } from "../../http/smartling-bare-list-response";

interface PeopleOffsetPageResponse<T> extends SmartlingBareListResponse<T> {
    offsetToken: string | null;
}

export { PeopleOffsetPageResponse };
