import { ContextType } from "../params/context-type";

interface ContextDto {
    name: string;
    contextType: ContextType;
    created: Date;
    contextUid: string;
}

export { ContextDto };
