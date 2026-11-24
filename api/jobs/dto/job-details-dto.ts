import { JobDto } from "./job-dto";
import { SourceFileDto } from "./source-file-dto";

interface JobDetailsDto extends JobDto {
    priority: number | null;
    sourceFiles: Array<SourceFileDto> | null;
}

export { JobDetailsDto };
