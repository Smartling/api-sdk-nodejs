import { BaseParameters } from "../../parameters/index";

export class CreateAttachmentParameters extends BaseParameters {
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

    setFileFromLocalFilePath(filePath: string): CreateAttachmentParameters {
        this.set("filePath", filePath);

        return this;
    }

    setFileContentFromBuffer(fileContent: Buffer): CreateAttachmentParameters {
        this.set("file", fileContent);

        return this;
    }

    setFileContentFromStream(fileContent: NodeJS.ReadableStream): CreateAttachmentParameters {
        this.set("file", fileContent);

        return this;
    }

    setFileName(fileName: string): CreateAttachmentParameters {
        this.set("fileName", fileName);

        return this;
    }
}
