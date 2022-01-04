import { Readable } from "stream";
import string2fileStream from "string-to-file-stream";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export class BaseParameters {
    protected parameters: Record<string, any>;

    constructor(parameters: Record<string, any> = {}) {
        this.parameters = parameters;
    }

    set(key: string, value: any): void {
        this.parameters[key] = value;
    }

    export(): Record<string, any> {
        return this.parameters;
    }

    public static async readableStreamToFileStream(readableStream: Readable): Promise<Readable> {
        readableStream.resume();

        let fileStream = null;

        return new Promise((resolve, reject) => {
            readableStream.on("data", (chunk) => {
                fileStream = string2fileStream(Buffer.from(chunk));
            });
            readableStream.on("error", err => reject(err));
            readableStream.on("end", () => resolve(fileStream));
        });
    }
}
