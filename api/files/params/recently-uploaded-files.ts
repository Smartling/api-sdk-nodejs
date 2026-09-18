import { SmartlingException } from "../../exception";
import { BaseParameters } from "../../parameters/index";
import { FileType } from "./file-type";
import { FilesOrderBy } from "./files-order-by";

export class RecentlyUploadedFilesParameters extends BaseParameters {
    setUriMask(uriMask: string): RecentlyUploadedFilesParameters {
        this.set("uriMask", uriMask);

        return this;
    }

    setLimit(limit: number): RecentlyUploadedFilesParameters {
        if (limit > 0) {
            this.set("limit", limit);

            return this;
        }

        throw new SmartlingException("Limit must be > 0");
    }

    setOffset(offset: number): RecentlyUploadedFilesParameters {
        if (offset >= 0) {
            this.set("offset", offset);

            return this;
        }

        throw new SmartlingException("Offset must be >= 0");
    }

    setFileTypes(fileTypes: FileType[]): RecentlyUploadedFilesParameters {
        this.set("fileTypes[]", fileTypes);

        return this;
    }

    setLastUploadedAfter(date: Date): RecentlyUploadedFilesParameters {
        this.set("lastUploadedAfter", `${date.toISOString().split(".")[0]}Z`);

        return this;
    }

    setLastUploadedBefore(date: Date): RecentlyUploadedFilesParameters {
        this.set("lastUploadedBefore", `${date.toISOString().split(".")[0]}Z`);

        return this;
    }

    setOrderBy(orderBy: FilesOrderBy): RecentlyUploadedFilesParameters {
        this.set("orderBy", orderBy);

        return this;
    }
}
