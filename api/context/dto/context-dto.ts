import { ContextType } from "../params/context-type";
import { ContextSourceDto } from "./context-source-dto";

interface ContextDto {
    name: string;
    contextType: ContextType;
    created: Date;
    contextUid: string;
    contentUri?: string;
    title?: string;
    contextSource?: ContextSourceDto;
}

export { ContextDto };
