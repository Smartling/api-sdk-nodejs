import { BindingDto } from "./binding-dto";
import { CoordinatesDto } from "./coordinates-dto";
import { TimecodeDto } from "./timecode-dto";

interface BindingDetailsDto extends BindingDto {
    bindingUid?: string;
    anchors?: Array<string>;
    contextPosition?: number;
    coordinates?: CoordinatesDto;
    timecode?: TimecodeDto;
}

export { BindingDetailsDto };
