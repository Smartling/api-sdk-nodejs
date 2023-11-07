import { DownloadFileParameters } from "./download-file-parameters";


export class DownloadFileAllTranslationsParameters extends DownloadFileParameters {
    setZipFileName(fileName: string): DownloadFileAllTranslationsParameters {
        this.set("zipFileName", fileName);
        return this;
    }
}
