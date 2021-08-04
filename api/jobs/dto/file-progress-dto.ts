import { ContentProgressReportItemDto } from "./content-progress-report-item-dto";

interface FileProgressDto {
    contentProgressReport: Array<ContentProgressReportItemDto>;
    progress: {
        data: {
            percentComplete: number;
            totalWordCount: number;
        }
    }
}

export { FileProgressDto };
