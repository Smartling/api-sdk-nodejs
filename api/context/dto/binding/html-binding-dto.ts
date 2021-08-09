import { BindingDto } from "./binding-dto";

interface HtmlBindingDto extends BindingDto {
    selector: {
        anchors: Array<string>
    };
}

export { HtmlBindingDto };
