import { SmartlingException } from "../../exception";
import { BaseParameters } from "../../parameters/index";
import { FileFilter } from "./file-filter";
import { FileLocaleMode } from "./file-locale-mode";
import { FileLocales } from "./file-locales";
import { TranslationFileNameMode } from "./translation-file-name-mode";
import { RetrievalType } from "./retrieval-type";

export class DownloadMultipleFilesTranslationsParameters extends BaseParameters {
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

    setRetrievalType(retrievalType: RetrievalType): this {
        this.set("retrievalType", retrievalType);

        return this;
    }

    includeOriginalStrings(): this {
        this.set("includeOriginalStrings", true);

        return this;
    }

    excludeOriginalStrings(): this {
        this.set("includeOriginalStrings", false);

        return this;
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
