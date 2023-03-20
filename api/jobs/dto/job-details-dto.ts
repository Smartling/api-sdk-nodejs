import { JobDto } from "./job-dto";
import { SourceFileDto } from "./source-file-dto";

interface JobDetailsDto extends JobDto {
    priority: string;
    sourceFiles: Array<SourceFileDto>;
}

export { JobDetailsDto };
