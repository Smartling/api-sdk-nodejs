import { ProjectCopyProcessState } from "./project-copy-process-state";
import { ProjectCopyProcessStatisticsDto } from "./project-copy-process-statistics-dto";

interface ProjectCopyRequestStatusDto {
    processUid: string;
    newProjectUid: string | null;
    processState: ProjectCopyProcessState;
    createdDate: Date;
    modifiedDate: Date;
    processStatistics: ProjectCopyProcessStatisticsDto;
}

export { ProjectCopyRequestStatusDto };
