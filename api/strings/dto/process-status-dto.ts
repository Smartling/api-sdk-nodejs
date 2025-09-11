import { ProcessStatisticsDto } from "./process-statistics-dto";
import { ProcessState } from "./process-state-enum";

interface ProcessStatusDto {
    processUid: string;
    processState: ProcessState;
    createdDate: string;
    modifiedDate: string;
    processStatistics: ProcessStatisticsDto;
}

export { ProcessStatusDto, ProcessState };
