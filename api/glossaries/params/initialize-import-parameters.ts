import * as fs from "fs";
import string2fileStream from "string-to-file-stream";
import { BaseParameters } from "../../parameters/index";
import { ImportFileMediaType } from "../enums/import-file-media-type";

export class InitializeImportParameters extends BaseParameters {
    setArchiveMode(archiveMode: boolean): InitializeImportParameters {
        this.set("archiveMode", archiveMode);

        return this;
    }

    setImportFileFromLocalFilePath(filePath: string): InitializeImportParameters {
        this.set("importFile", fs.createReadStream(fs.realpathSync(filePath)));

        return this;
    }

    setImportFileContent(fileContent: string): InitializeImportParameters {
        this.set("importFile", string2fileStream(fileContent));

        return this;
    }

    setImportFileContentFromBuffer(fileContent: Buffer): InitializeImportParameters {
        this.set("importFile", fileContent);

        return this;
    }

    setImportFileName(importFileName: string): InitializeImportParameters {
        this.set("importFileName", importFileName);

        return this;
    }

    setImportFileMediaType(importFileMediaType: ImportFileMediaType): InitializeImportParameters {
        this.set("importFileMediaType", importFileMediaType);

        return this;
    }
}
