import {ContextTypeEnum} from "../params/context-type-enum";

export interface ContextDto {
	name: string;
	contextType: ContextTypeEnum;
	created: string;
	contextUid: string;
}
