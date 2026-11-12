import { BaseParameters } from "../../parameters/index";

export class ListLocaleMappingsParameters extends BaseParameters {
    setOffset(offset: number): ListLocaleMappingsParameters {
        this.set("offset", offset);

        return this;
    }

    setLimit(limit: number): ListLocaleMappingsParameters {
        this.set("limit", limit);

        return this;
    }

    setSortBy(sortBy: "uid" | "created" | "modified"): ListLocaleMappingsParameters {
        this.set("sortBy", sortBy);

        return this;
    }

    setOrderBy(orderBy: "asc" | "desc"): ListLocaleMappingsParameters {
        this.set("orderBy", orderBy);

        return this;
    }

    setIntegrationId(integrationId: string): ListLocaleMappingsParameters {
        this.set("integrationId", integrationId);

        return this;
    }
}
