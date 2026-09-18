import { DownloadFileParameters } from "./download-file-parameters";

export class DownloadFileAllTranslationsParameters extends DownloadFileParameters {
    setZipFileName(zipFileName: string): this {
        this.set("zipFileName", zipFileName);

        return this;
    }
}
