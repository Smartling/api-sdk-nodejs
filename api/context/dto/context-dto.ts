import { ContextType } from "../params/context-type";

interface ContextDto {
    name: string;
    contextType: ContextType;
    created: string;
    contextUid: string;
}

export { ContextDto };
