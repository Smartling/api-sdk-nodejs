import sinon from "sinon";
import { loggerMock, authMock, responseMock } from "./mock";
import { Order } from "../api/jobs/params/order";
import { ListJobsParameters } from "../api/jobs/params/list-jobs-parameters";
import { SmartlingJobsApi } from "../api/jobs";
import { FileProgressParameters } from "../api/jobs/params/file-progress-parameters";
import { SmartlingAuthApi } from "../api/auth";
import { CreateJobParameters } from "../api/jobs/params/create-job-parameters";
import { ListJobFilesParameters } from "../api/jobs/params/list-job-files-parameters";
import { JobStatus } from "../api/jobs/params/job-status";
import { RemoveFileParameters } from "../api/jobs/params/remove-file-parameters";

describe("SmartlingJobAPI class tests.", () => {
    const projectId = "testProjectId";
    const jobUid = "testJobUid";
    const fileUri = "testFileUri.json";
    const sortByFieldName = "name";
    let jobApi;
    let jobServiceApiFetchStub;
    let jobServiceApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        jobApi = new SmartlingJobsApi(authMock as unknown as SmartlingAuthApi, loggerMock, "https://test.com");
        jobServiceApiFetchStub = sinon.stub(jobApi, "fetch");
        jobServiceApiUaStub = sinon.stub(jobApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        jobServiceApiUaStub.returns("test_user_agent");
        jobServiceApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        jobServiceApiFetchStub.restore();
        responseMockJsonStub.restore();
        jobServiceApiUaStub.restore();
    });

    describe("Methods", () => {
        it("Create job", async () => {
            const params = new CreateJobParameters();

            params
                .setName("Test job")
                .setDescription("Test job description")
                .setDueDate(new Date("2100-12-31T22:00:00.000Z"));


            await jobApi.createJob(projectId, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs`,
                {
                    body: "{\"jobName\":\"Test job\",\"description\":\"Test job description\",\"dueDate\":\"2100-12-31T22:00:00.000Z\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Get job", async () => {
            await jobApi.getJob(projectId, jobUid);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });

        it("Get job files", async () => {
            const params = new ListJobFilesParameters();

            params
                .setOffset(10)
                .setLimit(100);

            await jobApi.getJobFiles(projectId, jobUid, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/files?offset=10&limit=100`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });

        it("List jobs", async () => {
            const params = new ListJobsParameters()
                .setName("testName")
                .setStatuses(JobStatus.AWAITING_AUTHORIZATION)
                .setSort(sortByFieldName, Order.ASC)
                .setLimit(100)
                .setOffset(10);

            await jobApi.listJobs(projectId, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs?jobName=testName&translationJobStatus=AWAITING_AUTHORIZATION&sortBy=name&sortDirection=ASC&limit=100&offset=10`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });

        it("Get job file progress", async () => {
            const params = new FileProgressParameters();

            params.setFileUri(fileUri);

            await jobApi.getJobFileProgress(projectId, jobUid, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/file/progress?fileUri=${encodeURIComponent(fileUri)}`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });

        it("Remove file from job", async () => {
            const params = new RemoveFileParameters();

            params.setFileUri(fileUri);

            await jobApi.removeFileFromJob(projectId, jobUid, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/file/remove`,
                {
                    body: "{\"fileUri\":\"testFileUri.json\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });
    });
});
