import * as fs from "fs";
import string2fileStream from "string-to-file-stream";
import { BaseParameters } from "../../parameters/index";
import { FileType } from "./file-type";
import { TranslationState } from "./translation-state";
import { SmartlingException } from "../../exception";

export class ImportFileParameters extends BaseParameters {
    setFileFromLocalFilePath(filePath: string): ImportFileParameters {
        this.set("file", fs.createReadStream(
            fs.realpathSync(filePath)
        ));
        return this;
    }

    setFileContent(fileContent: string): ImportFileParameters {
        this.set("file", string2fileStream(fileContent));
        return this;
    }

    setFileUri(fileUri: string): ImportFileParameters {
        this.set("fileUri", fileUri);
        return this;
    }

    setFileType(fileType: FileType): ImportFileParameters {
        this.set("fileType", fileType);
        return this;
    }

    setTranslationState(translationState: TranslationState): ImportFileParameters {
        this.set("translationState", translationState);
        return this;
    }

    setOverwrite(overwrite: boolean): ImportFileParameters {
        this.set("overwrite", String(overwrite));
        return this;
    }

    setCallbackUrl(callbackUrl: string): ImportFileParameters {
        if (callbackUrl && (callbackUrl.length > 255)) {
            throw new SmartlingException("File callback URL should be not greater than 255 characters.");
        }

        this.set("callbackUrl", callbackUrl);
        return this;
    }
}
