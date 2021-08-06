import { JobDto } from "./job-dto";
import { FullSourceFileDto } from "./full-source-file-dto";

interface JobDetailsDto extends JobDto {
    priority: string;
    sourceFiles: Array<FullSourceFileDto>;
}

export { JobDetailsDto };
