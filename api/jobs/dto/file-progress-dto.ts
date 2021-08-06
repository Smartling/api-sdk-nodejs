import { ContentProgressReportItemDto } from "./content-progress-report-item-dto";
import { FileProgressItemDto } from "./file-progress-item-dto";
import { SummaryReportItemDto } from "./summary-report-item-dto";

interface FileProgressDto {
    contentProgressReport: Array<ContentProgressReportItemDto>;
    progress: FileProgressItemDto,
    summaryReport: Array<SummaryReportItemDto>
}

export { FileProgressDto };
