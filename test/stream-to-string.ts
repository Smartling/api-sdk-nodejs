import { Readable } from "stream";

function streamToString(stream: Readable): Promise<string> {
    const chunks = [];

    stream.resume();

    return new Promise((resolve, reject) => {
        // eslint-disable-next-line fp/no-mutating-methods
        stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
        stream.on("error", err => reject(err));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
}

export { streamToString };
