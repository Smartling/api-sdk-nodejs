import * as fs from "fs";
import string2fileStream from "string-to-file-stream";
import { BaseParameters } from "../../parameters/index";
import { EscapeSmpUnicodeParserDirective } from "./escape-smp-unicode-parser-directive";

export class ImportTmxFileParameters extends BaseParameters {
    setFileFromLocalFilePath(filePath: string): ImportTmxFileParameters {
        this.set("file", fs.createReadStream(
            fs.realpathSync(filePath)
        ));

        return this;
    }

    setFileContent(fileContent: string): ImportTmxFileParameters {
        this.set("file", string2fileStream(fileContent));

        return this;
    }

    setFileContentFromBuffer(fileContent: Buffer): ImportTmxFileParameters {
        this.set("file", fileContent);

        return this;
    }

    setFileUri(fileUri: string): ImportTmxFileParameters {
        this.set("fileUri", fileUri);

        return this;
    }

    setTmUid(tmUid: string): ImportTmxFileParameters {
        this.set("tmUid", tmUid);

        return this;
    }

    setDescription(description: string): ImportTmxFileParameters {
        this.set("description", description);

        return this;
    }

    setTranslatorNameLocation(translatorNameLocation: string): ImportTmxFileParameters {
        this.set("translatorNameLocation", translatorNameLocation);

        return this;
    }

    setTranslationDateLocation(translationDateLocation: string): ImportTmxFileParameters {
        this.set("translationDateLocation", translationDateLocation);

        return this;
    }

    setVariantLocation(variantLocation: string): ImportTmxFileParameters {
        this.set("variantLocation", variantLocation);

        return this;
    }

    setFileUriLocation(fileUriLocation: string): ImportTmxFileParameters {
        this.set("fileUriLocation", fileUriLocation);

        return this;
    }

    setEscapeSmpUnicodeParserDirective(
        escapeSmpUnicodeParserDirective: EscapeSmpUnicodeParserDirective
    ): ImportTmxFileParameters {
        this.set("escapeSmpUnicodeParserDirective", escapeSmpUnicodeParserDirective);

        return this;
    }
}
