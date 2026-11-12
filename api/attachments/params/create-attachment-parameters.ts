import { BaseParameters } from "../../parameters/index";

export class CreateAttachmentParameters extends BaseParameters {
    /**
     * Required. The attachment's display name (the service accepts at most 150 characters). It is
     * not a unique identifier. For a buffer or stream upload without setFileName() it is also used
     * as the uploaded file's name, so include the extension (for example "report.pdf").
     */
    setName(name: string): CreateAttachmentParameters {
        this.set("name", name);

        return this;
    }

    setDescription(description: string): CreateAttachmentParameters {
        this.set("description", description);

        return this;
    }

    setLocaleId(localeId: string): CreateAttachmentParameters {
        this.set("localeId", localeId);

        return this;
    }

    setEntityUids(entityUids: Array<string>): CreateAttachmentParameters {
        this.set("entityUids", entityUids);

        return this;
    }

    /**
     * Uploads a file from disk. The uploaded file's name defaults to the path's base name.
     * A file set with setFileContentFromBuffer() or setFileContentFromStream() takes precedence
     * if both are set.
     */
    setFileFromLocalFilePath(filePath: string): CreateAttachmentParameters {
        this.set("filePath", filePath);

        return this;
    }

    /**
     * Uploads in-memory content. Unless setFileName() is called, the uploaded file's name is the
     * attachment name from setName(), so one with an extension keeps downloads usable.
     */
    setFileContentFromBuffer(fileContent: Buffer): CreateAttachmentParameters {
        this.set("file", fileContent);

        return this;
    }

    /**
     * Uploads a readable stream. Unless setFileName() is called, the uploaded file's name is the
     * attachment name from setName(), so one with an extension keeps downloads usable.
     */
    setFileContentFromStream(fileContent: NodeJS.ReadableStream): CreateAttachmentParameters {
        this.set("file", fileContent);

        return this;
    }

    /**
     * The name the service stores the file under and returns in the download's Content-Disposition,
     * including its extension. It also determines the content type. Empty values are ignored.
     */
    setFileName(fileName: string): CreateAttachmentParameters {
        this.set("fileName", fileName);

        return this;
    }
}
