import { DownloadFileParameters } from "./download-file-parameters";
import { FileNameMode } from "./filename-mode";

export class DownloadFileWithMetadataParameters extends DownloadFileParameters {
    setFileNameMode(fileNameMode: FileNameMode): DownloadFileParameters {
        if (fileNameMode === FileNameMode.TRANSFORMED) {
            this.set("changeFileName", true);
        }

        return this;
    }
}
