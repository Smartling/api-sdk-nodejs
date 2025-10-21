import { DownloadFileBaseParameters } from "./download-file-base-parameters";

export class DownloadFileParameters extends DownloadFileBaseParameters {
    enableDebugMode(): DownloadFileParameters {
        this.set("debugMode", 1);

        return this;
    }
}
