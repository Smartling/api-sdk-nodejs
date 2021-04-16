import {OrderByEnum} from "./order-by-enum";
import {SortByEnum} from "./sort-by-enum";
import {StateEnum} from "./state-enum";
import SmartlingException from "../../exception";
import BaseParameters from "../../parameters";

export class SearchTranslationPackagesParameters extends BaseParameters {
	public setOrderBy(orderBy: OrderByEnum): SearchTranslationPackagesParameters {
		if (!Object.values(OrderByEnum).includes(orderBy)) {
			throw new SmartlingException(`Allowed orderBy values are: ${Object.values(OrderByEnum).join(', ')}`);
		}

		this.set("orderBy", orderBy);

		return this;
	}

	public setSortBy(sortBy: SortByEnum): SearchTranslationPackagesParameters {
		if (!Object.values(SortByEnum).includes(sortBy)) {
			throw new SmartlingException(`Allowed sortBy values are: ${Object.values(SortByEnum).join(', ')}`);
		}

		this.set("sortBy", sortBy);

		return this;
	}

	public setState(state: StateEnum): SearchTranslationPackagesParameters {
		if (!Object.values(StateEnum).includes(state)) {
			throw new SmartlingException(`Allowed state values are: ${Object.values(StateEnum).join(', ')}`);
		}

		this.set("state", state);

		return this;
	}

	public setLimit(limit: number): SearchTranslationPackagesParameters {
		if (limit < 0) {
			throw new SmartlingException("Limit parameter cannot be a negative number");
		}
		this.set("limit", limit);

		return this;
	}

	public setOffset(offset: number): SearchTranslationPackagesParameters {
		if (offset < 0) {
			throw new SmartlingException("offset parameter cannot be a negative number");
		}
		this.set("offset", offset);

		return this;
	}

	public setCustomData(customData: any): SearchTranslationPackagesParameters {
		this.set("customData", JSON.stringify(customData));

		return this;
	}

	public setPackageKey(packageKey: any): SearchTranslationPackagesParameters {
		this.set("packageKey", JSON.stringify(packageKey));

		return this;
	}

	public setTitle(title: string): SearchTranslationPackagesParameters {
		this.set("title", title);

		return this;
	}
}
