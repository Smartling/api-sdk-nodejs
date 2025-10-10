import { BaseParameters } from "../../parameters/index";
import { Order } from "../../parameters/order";
import { BatchStatus } from "./batch-status";

export class ListBatchesParameters extends BaseParameters {
    setTranslationJobUid(uid: string): ListBatchesParameters {
        this.set("translationJobUid", uid);

        return this;
    }

    setLimit(limit: number): ListBatchesParameters {
        if (limit > 0) {
            this.set("limit", limit);
        }

        return this;
    }

    setOffset(offset: number): ListBatchesParameters {
        if (offset >= 0) {
            this.set("offset", offset);
        }

        return this;
    }

    setStatus(status: BatchStatus): ListBatchesParameters {
        this.set("status", status);

        return this;
    }

    setSort(field: "createdDate" | "status", order: Order): ListBatchesParameters {
        this.set("sortBy", field);
        this.set("sortDirection", order.toLowerCase());

        return this;
    }
}
