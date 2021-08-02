import { ContextType } from "../params/context-type";

export interface ContextDto {
    name: string;
    contextType: ContextType;
    created: Date;
    contextUid: string;
}
