import { SmartlingException } from "../../exception";
import { FileFilter } from "./file-filter";
import { FileLocaleMode } from "./file-locale-mode";
import { FileLocales } from "./file-locales";
import { TranslationFileNameMode } from "./translation-file-name-mode";
import { DownloadFileBaseParameters } from "./download-file-base-parameters";

export class DownloadMultipleFilesTranslationsParameters extends DownloadFileBaseParameters {
    constructor(
        files: FileLocales[]
    ) {
        super();

        if (!files.length) {
            throw new SmartlingException("At least one file is required.");
        }

        files.forEach((file) => {
            if (!file.localeIds.length) {
                throw new SmartlingException(`At least one locale is required for fileUri: ${file.fileUri}`);
            }
        });

        this.set("files", files);
    }

    setFileNameMode(fileNameMode: TranslationFileNameMode): this {
        this.set("fileNameMode", fileNameMode);

        return this;
    }

    setFileLocaleMode(fileLocaleMode: FileLocaleMode): this {
        this.set("localeMode", fileLocaleMode);

        return this;
    }

    setZipFileName(zipFileName: string): this {
        this.set("zipFileName", zipFileName);

        return this;
    }

    setFileFilter(fileFilter: FileFilter): this {
        this.set("fileFilter", fileFilter);

        return this;
    }
}
