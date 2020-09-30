import BaseParameters from "../../parameters";
import {ActionEnum} from "./action-enum";

export class MappingParameters extends BaseParameters {
	public setAction(action: ActionEnum): MappingParameters {
		this.set("action", action);

		return this;
	};
}
