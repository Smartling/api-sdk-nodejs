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
import { SmartlingListResponse } from "../http/smartling-list-response";
import { BaseJobDto } from "./dto/base-job-dto";
import { FileProgressDto } from "./dto/file-progress-dto";
import { RemovedFileDto } from "./dto/removed-file-dto";
import { JobProgressDto } from "./dto/job-progress-dto";
import { JobProgressParameters } from "./params/job-progress-parameters";
import { CancelJobParameters } from "./params/cancel-job-parameters";
import { CloseJobParameters } from "./params/close-job-parameters";
import { SearchJobsParameters } from "./params/search-jobs-parameters";
import { FullSourceFileDto } from "./dto/full-source-file-dto";

export class SmartlingJobsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: SmartlingAuthApi, logger: Logger) {
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
    ): Promise<SmartlingListResponse<FullSourceFileDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/files`,
            params.export()
        );
    }

    async listJobs(
        projectId: string, params: ListJobsParameters
    ): Promise<SmartlingListResponse<BaseJobDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs`,
            params.export()
        );
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async searchJobs(
        projectId: string, params: SearchJobsParameters
    ): Promise<SmartlingListResponse<BaseJobDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/search`,
            JSON.stringify(params.export())
        );
    }

    async removeFileFromJob(
        projectId: string, translationJobUid: string, params: RemoveFileParameters
    ): Promise<RemovedFileDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/file/remove`,
            JSON.stringify(params.export())
        );
    }

    async getJobProgress(
        projectId: string, translationJobUid: string, params: JobProgressParameters
    ): Promise<JobProgressDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/progress`,
            params.export()
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

    async cancelJob(
        projectId: string, translationJobUid: string, params: CancelJobParameters
    ): Promise<void> {
        await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/cancel`,
            JSON.stringify(params.export())
        );
    }

    async closeJob(
        projectId: string, translationJobUid: string, params: CloseJobParameters
    ): Promise<void> {
        await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/close`,
            JSON.stringify(params.export())
        );
    }
}
