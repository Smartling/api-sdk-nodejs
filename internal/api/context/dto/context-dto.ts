import {ContextTypeEnum} from "../params/context-type-enum";

export interface ContextDto {
    name: string;
    contextType: ContextTypeEnum;
    created: Date;
    contextUid: string;
}
