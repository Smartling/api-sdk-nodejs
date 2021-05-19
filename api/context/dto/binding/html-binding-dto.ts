import { BindingDto } from "./binding-dto";

export interface HtmlBindingDto extends BindingDto {
    selector: {
        anchors: Array<string>
    };
}
