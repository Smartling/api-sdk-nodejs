import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { CreateJobParameters } from "./params/create-job-parameters";
import { ListJobFilesParameters } from "./params/list-job-files-parameters";
import { ListJobsParameters } from "./params/list-jobs-parameters";
import { RemoveFileParameters } from "./params/remove-file-parameters";
import { FileProgressParameters } from "./params/file-progress-parameters";
import { JobDetailsDto } from "./dto/job-details-dto";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { JobListItemDto } from "./dto/job-list-item-dto";
import { FileProgressDto } from "./dto/file-progress-dto";
import { AddFileParameters } from "./params/add-file-parameters";
import { RemovedFileDto } from "./dto/removed-file-dto";
import { JobProgressDto } from "./dto/job-progress-dto";
import { JobProgressParameters } from "./params/job-progress-parameters";
import { CancelJobParameters } from "./params/cancel-job-parameters";
import { CloseJobParameters } from "./params/close-job-parameters";
import { SearchJobsParameters } from "./params/search-jobs-parameters";
import { FullSourceFileDto } from "./dto/full-source-file-dto";
import { AddedFileDto } from "./dto/added-file-dto";
import { AuthorizeJobParameters } from "./params/authorize-job-parameters";
import { UpdateJobParameters } from "./params/update-job-parameters";
import { AddStringsToJobParameters } from "./params/add-strings-to-job-parameters";
import { RemoveStringsFromJobParameters } from "./params/remove-strings-from-job-parameters";
import { AddedStringsDto } from "./dto/added-strings-dto";
import { RemovedStringsDto } from "./dto/removed-strings-dto";
import { JobWithProcessDto } from "./dto/job-with-process-dto";
import { JobLocaleCompletionDateDto } from "./dto/job-locale-completion-date-dto";
import { JobScheduleDto } from "./dto/job-schedule-dto";
import { JobByStringsDto } from "./dto/job-by-strings-dto";
import { JobCertificateLocaleDto } from "./dto/job-certificate-locale-dto";
import { GetJobsWithProcessesParameters } from "./params/get-jobs-with-processes-parameters";
import { FindJobsByStringsParameters } from "./params/find-jobs-by-strings-parameters";

export class SmartlingJobsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/jobs-api/v3/projects`;
    }

    async createJob(projectId: string, params: CreateJobParameters): Promise<JobDetailsDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs`,
            JSON.stringify(params.export())
        );
    }

    async updateJob(
        projectId: string,
        translationJobUid: string,
        params: UpdateJobParameters
    ): Promise<JobDetailsDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}`,
            JSON.stringify(params.export())
        );
    }

    async getJob(projectId: string, translationJobUid: string): Promise<JobDetailsDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}`
        );
    }

    async authorizeJob(projectId: string, translationJobUid: string, params: AuthorizeJobParameters
    ): Promise<Record<string, unknown>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/authorize`,
            JSON.stringify(params.export())
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
    ): Promise<SmartlingListResponse<JobListItemDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs`,
            params.export()
        );
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async searchJobs(
        projectId: string, params: SearchJobsParameters
    ): Promise<SmartlingListResponse<JobListItemDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/search`,
            JSON.stringify(params.export())
        );
    }

    async addFileToJob(
        projectId: string, translationJobUid: string, params: AddFileParameters
    ): Promise<AddedFileDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/file/add`,
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

    async deleteJob(
        projectId: string, translationJobUid: string
    ): Promise<void> {
        await this.makeRequest(
            "delete",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}`
        );
    }

    async addStringsToJob(
        projectId: string, translationJobUid: string, params: AddStringsToJobParameters
    ): Promise<AddedStringsDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/strings/add`,
            JSON.stringify(params.export())
        );
    }

    async removeStringsFromJob(
        projectId: string, translationJobUid: string, params: RemoveStringsFromJobParameters
    ): Promise<RemovedStringsDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/strings/remove`,
            JSON.stringify(params.export())
        );
    }

    async getJobsWithActiveProcess(
        projectId: string, params: GetJobsWithProcessesParameters
    ): Promise<SmartlingListResponse<JobWithProcessDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${encodeURIComponent(projectId)}/jobs/processes`,
            JSON.stringify(params.export())
        );
    }

    async getJobLocalesCompletionDates(
        projectId: string, translationJobUid: string
    ): Promise<SmartlingListResponse<JobLocaleCompletionDateDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${encodeURIComponent(projectId)}/jobs/${encodeURIComponent(translationJobUid)}/locales-completion-dates`
        );
    }

    // Returns a list (one item per locale and workflow step), although the public API reference
    // shows a single object.
    async getJobSchedule(
        projectId: string, translationJobUid: string
    ): Promise<SmartlingListResponse<JobScheduleDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${encodeURIComponent(projectId)}/jobs/${encodeURIComponent(translationJobUid)}/schedule`
        );
    }

    async findJobsByStrings(
        projectId: string, params: FindJobsByStringsParameters
    ): Promise<SmartlingListResponse<JobByStringsDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${encodeURIComponent(projectId)}/jobs/find-jobs-by-strings`,
            JSON.stringify(params.export())
        );
    }

    async getJobCertificates(
        projectId: string, translationJobUid: string
    ): Promise<SmartlingListResponse<JobCertificateLocaleDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${encodeURIComponent(projectId)}/jobs/${encodeURIComponent(translationJobUid)}/certificates`
        );
    }
}
