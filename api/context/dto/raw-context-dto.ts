import { ContextType } from "../params/context-type";

interface RawContextDto {
    name: string;
    contextType: ContextType;
    created: string;
    contextUid: string;
}

export { RawContextDto };
