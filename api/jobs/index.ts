import { SmartlingBaseApi } from "../base/index";
import { SmartlingAuthApi } from "../auth/index";
import { Logger } from "../logger";
import { CreateJobParameters } from "./params/create-job-parameters";
import { ListJobFilesParameters } from "./params/list-job-files-parameters";
import { ListJobsParameters } from "./params/list-jobs-parameters";
import { RemoveFileParameters } from "./params/remove-file-parameters";
import { FileProgressParameters } from "./params/file-progress-parameters";
import { JobDto } from "./dto/job-dto";
import { JobDetailsDto } from "./dto/job-details-dto";
import { HTTPResponse } from "../http/response";
import { FullSourceFileDto } from "./dto/full-source-file-dto";
import { BaseJobDto } from "./dto/base-job-dto";
import { FileProgressDto } from "./dto/file-progress-dto";

export class SmartlingJobsApi extends SmartlingBaseApi {
    constructor(authApi: SmartlingAuthApi, logger: Logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/jobs-api/v3/projects`;
    }

    async createJob(projectId: string, params: CreateJobParameters): Promise<JobDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs`,
            JSON.stringify(params.export())
        );
    }

    async getJob(projectId: string, translationJobUid: string): Promise<JobDetailsDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}`
        );
    }

    async getJobFiles(
        projectId: string, translationJobUid: string, params: ListJobFilesParameters
    ): Promise<HTTPResponse<FullSourceFileDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/files`,
            params.export()
        );
    }

    async listJobs(
        projectId: string, params: ListJobsParameters
    ): Promise<HTTPResponse<BaseJobDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs`,
            params.export()
        );
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async searchJobs(projectId: string, params) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/search`,
            params.export()
        );
    }

    async removeFileFromJob(
        projectId: string, translationJobUid: string, params: RemoveFileParameters
    ): Promise<boolean> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/file/remove`,
            JSON.stringify(params.export())
        );
    }

    async getJobFileProgress(
        projectId: string, translationJobUid: string, params: FileProgressParameters
    ): Promise<FileProgressDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/file/progress`,
            params.export()
        );
    }
}
