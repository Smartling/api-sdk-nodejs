import { SmartlingBaseApi } from "./base-api";
import { TranslatedFileDto } from "../dto/translated-file-dto";

export class SmartlingBaseFileApi extends SmartlingBaseApi {
    static async downloadResponseToTranslatedFileDto(
        response: Response
    ): Promise<TranslatedFileDto> {
        const contentType = response.headers.get("content-type") ?? undefined;
        const contentDisposition = response.headers.get("content-disposition");
        let fileName;
        if (contentDisposition) {
            const encodedFileNameMatch = contentDisposition.match(/filename\*=[^']*''([^;]+)/);
            if (encodedFileNameMatch) {
                fileName = decodeURIComponent(encodedFileNameMatch[1]);
            } else {
                const fileNameMatch = contentDisposition.match(/filename="((?:[^"\\]|\\.)*)"/);
                if (fileNameMatch) {
                    fileName = fileNameMatch[1].replace(/\\"/g, "\"");
                }
            }
        }
        return {
            fileContent: await response.arrayBuffer(),
            fileName,
            contentType
        };
    }
}
