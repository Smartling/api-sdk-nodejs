import { LabelType } from "../enums/label-type";

export interface LabelTypeDto {
    type: LabelType;
    labelUids?: Array<string>;
}
