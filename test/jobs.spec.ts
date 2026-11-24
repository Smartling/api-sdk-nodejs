import assert from "assert";
import sinon from "sinon";
import { SmartlingException } from "../api/exception/index";
import { loggerMock, authMock, responseMock } from "./mock";
import { Order } from "../api/parameters/order";
import { ListJobsParameters } from "../api/jobs/params/list-jobs-parameters";
import { SmartlingJobsApi } from "../api/jobs/index";
import { FileProgressParameters } from "../api/jobs/params/file-progress-parameters";
import { SmartlingAuthApi } from "../api/auth/index";
import { CreateJobParameters } from "../api/jobs/params/create-job-parameters";
import { ListJobFilesParameters } from "../api/jobs/params/list-job-files-parameters";
import { JobStatus } from "../api/jobs/params/job-status";
import { RemoveFileParameters } from "../api/jobs/params/remove-file-parameters";
import { JobProgressParameters } from "../api/jobs/params/job-progress-parameters";
import { CancelJobParameters } from "../api/jobs/params/cancel-job-parameters";
import { CloseJobParameters } from "../api/jobs/params/close-job-parameters";
import { AddFileParameters } from "../api/jobs/params/add-file-parameters";
import { AuthorizeJobParameters } from "../api/jobs/params/authorize-job-parameters";
import { UpdateJobParameters } from "../api/jobs/params/update-job-parameters";
import { CallbackMethod } from "../api/jobs/params/callback-method";
import { AddStringsToJobParameters } from "../api/jobs/params/add-strings-to-job-parameters";
import { RemoveStringsFromJobParameters } from "../api/jobs/params/remove-strings-from-job-parameters";
import { GetJobsWithProcessesParameters } from "../api/jobs/params/get-jobs-with-processes-parameters";
import { FindJobsByStringsParameters } from "../api/jobs/params/find-jobs-by-strings-parameters";
import { SearchJobsParameters } from "../api/jobs/params/search-jobs-parameters";
import { JobCertificateStatus } from "../api/jobs/params/job-certificate-status";

describe("SmartlingJobsAPI class tests.", () => {
    const projectId = "testProjectId";
    const jobUid = "testJobUid";
    const fileUri = "testFileUri.json";
    const sortByFieldName = "name";
    let jobApi;
    let jobServiceApiFetchStub;
    let jobServiceApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        jobApi = new SmartlingJobsApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);
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
                .setDueDate(new Date("2100-12-31T22:00:00.000Z"))
                .setTargetLocaleIds(["pt-PT"])
                .setCallbackUrl("testCallbackUrl");

            await jobApi.createJob(projectId, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs`,
                {
                    body: "{\"jobName\":\"Test job\",\"description\":\"Test job description\",\"dueDate\":\"2100-12-31T22:00:00.000Z\",\"targetLocaleIds\":[\"pt-PT\"],\"callbackUrl\":\"testCallbackUrl\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Update job", async () => {
            const params = new UpdateJobParameters()
                .setName("Test job")
                .setDescription("Test job description")
                .setDueDate(new Date("2100-12-31T22:00:00.000Z"))
                .setReferenceNumber("CustomerReferenceNumber1")
                .setCallbackUrl("https://test-domain.com")
                .setCallbackMethod(CallbackMethod.GET)
                .setCustomFields([
                    {
                        fieldUid: "testFieldUid",
                        fieldValue: "testFieldValue"
                    }
                ]);

            await jobApi.updateJob(projectId, jobUid, params);

            sinon.assert.calledOnceWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}`,
                {
                    method: "put",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    body: JSON.stringify({
                        jobName: "Test job",
                        description: "Test job description",
                        dueDate: "2100-12-31T22:00:00.000Z",
                        referenceNumber: "CustomerReferenceNumber1",
                        callbackUrl: "https://test-domain.com",
                        callbackMethod: "GET",
                        customFields: [
                            {
                                fieldUid: "testFieldUid",
                                fieldValue: "testFieldValue"
                            }
                        ]
                    })
                }
            );
        });

        it("Update job: reset fields", async () => {
            const params = new UpdateJobParameters()
                .setName("Test job")
                .setDescription(null)
                .setDueDate(null)
                .setReferenceNumber(null)
                .setCallbackUrl(null)
                .setCallbackMethod(null)
                .setCustomFields([]);

            await jobApi.updateJob(projectId, jobUid, params);

            sinon.assert.calledOnceWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}`,
                {
                    method: "put",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    body: JSON.stringify({
                        jobName: "Test job",
                        description: null,
                        dueDate: null,
                        referenceNumber: null,
                        callbackUrl: null,
                        callbackMethod: null,
                        customFields: []
                    })
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

        it("Get job progress", async () => {
            const params = new JobProgressParameters();

            params.setTargetLocaleId("fr-FR");

            await jobApi.getJobProgress(projectId, jobUid, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/progress?targetLocaleId=fr-FR`,
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

        it("Adds file to job", async () => {
            const params = new AddFileParameters();

            params.setFileUri(fileUri);

            await jobApi.addFileToJob(projectId, jobUid, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/file/add`,
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

        it("Adds file to job with target locale ids", async () => {
            const params = new AddFileParameters();

            params.setFileUri(fileUri);
            params.setTargetLocaleIds(["fr-FR", "de-DE"]);

            await jobApi.addFileToJob(projectId, jobUid, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/file/add`,
                {
                    body: "{\"fileUri\":\"testFileUri.json\",\"targetLocaleIds\":[\"fr-FR\",\"de-DE\"]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Adds file to job with moveEnabled", async () => {
            const params = new AddFileParameters();

            params.setFileUri(fileUri);
            params.setMoveEnabled(true);

            await jobApi.addFileToJob(projectId, jobUid, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/file/add`,
                {
                    body: "{\"fileUri\":\"testFileUri.json\",\"moveEnabled\":true}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Authorizes a job", async () => {
            const params = new AuthorizeJobParameters();
            await jobApi.authorizeJob(projectId, jobUid, params);
            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/authorize`,
                {
                    body: "{}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );

            params.addLocaleWorkflows("fr", "wf1");
            params.addLocaleWorkflows("de", "wf2");
            await jobApi.authorizeJob(projectId, jobUid, params);
            sinon.assert.calledTwice(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/authorize`,
                {
                    body: "{\"localeWorkflows\":[{\"targetLocaleId\":\"fr\",\"workflowUid\":\"wf1\"},{\"targetLocaleId\":\"de\",\"workflowUid\":\"wf2\"}]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
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

        it("Cancel job", async () => {
            const params = new CancelJobParameters();

            params.setReason("Test reason");

            await jobApi.cancelJob(projectId, jobUid, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/cancel`,
                {
                    body: "{\"reason\":\"Test reason\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Close job", async () => {
            const params = new CloseJobParameters();

            await jobApi.closeJob(projectId, jobUid, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/close`,
                {
                    body: "{}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Delete job", async () => {
            await jobApi.deleteJob(projectId, jobUid);

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
                    method: "delete"
                }
            );
        });

        it("Add strings to job", async () => {
            const params = new AddStringsToJobParameters();
            const testHashcodes = ["hash1", "hash2", "hash3"];
            const testTargetLocaleIds = ["fr-FR", "de-DE"];

            params.setHashcodes(testHashcodes)
                .setMoveEnabled(true)
                .setTargetLocaleIds(testTargetLocaleIds);

            await jobApi.addStringsToJob(projectId, jobUid, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/strings/add`,
                {
                    body: "{\"hashcodes\":[\"hash1\",\"hash2\",\"hash3\"],\"moveEnabled\":true,\"targetLocaleIds\":[\"fr-FR\",\"de-DE\"]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Remove strings from job", async () => {
            const params = new RemoveStringsFromJobParameters();
            const testHashcodes = ["hash1", "hash2", "hash3"];
            const testTargetLocaleIds = ["fr-FR", "de-DE"];

            params.setHashcodes(testHashcodes)
                .setTargetLocaleIds(testTargetLocaleIds);

            await jobApi.removeStringsFromJob(projectId, jobUid, params);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/strings/remove`,
                {
                    body: "{\"hashcodes\":[\"hash1\",\"hash2\",\"hash3\"],\"targetLocaleIds\":[\"fr-FR\",\"de-DE\"]}",
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

    describe("getJobsWithActiveProcess", () => {
        it("posts the job uids", async () => {
            await jobApi.getJobsWithActiveProcess(
                projectId,
                new GetJobsWithProcessesParameters().setTranslationJobUids(["job1", "job2"])
            );

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/processes`,
                {
                    body: "{\"translationJobUids\":[\"job1\",\"job2\"]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("rejects an empty list of job uids", () => {
            assert.throws(
                () => new GetJobsWithProcessesParameters().setTranslationJobUids([]),
                SmartlingException
            );
        });

        it("rejects more than 500 job uids", () => {
            const tooMany = Array.from({ length: 501 }, (_, index) => `job${index}`);

            assert.throws(
                () => new GetJobsWithProcessesParameters().setTranslationJobUids(tooMany),
                SmartlingException
            );
        });
    });

    describe("getJobLocalesCompletionDates", () => {
        it("gets completion dates per locale", async () => {
            await jobApi.getJobLocalesCompletionDates(projectId, jobUid);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/locales-completion-dates`,
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
    });

    describe("path encoding of the new methods", () => {
        it("encodes the project and job uids", async () => {
            await jobApi.getJobSchedule("project/id", "job uid");

            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                "https://test.com/jobs-api/v3/projects/project%2Fid/jobs/job%20uid/schedule",
                sinon.match.object
            );
        });
    });

    describe("getJobSchedule", () => {
        it("gets the job schedule", async () => {
            await jobApi.getJobSchedule(projectId, jobUid);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/${jobUid}/schedule`,
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
    });

    describe("findJobsByStrings", () => {
        it("posts hashcodes and locale ids", async () => {
            await jobApi.findJobsByStrings(
                projectId,
                new FindJobsByStringsParameters().setHashcodes(["hash1"]).setLocaleIds(["fr-FR", "de-DE"])
            );

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/find-jobs-by-strings`,
                {
                    body: "{\"hashcodes\":[\"hash1\"],\"localeIds\":[\"fr-FR\",\"de-DE\"]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("omits locale ids when only hashcodes are set", async () => {
            await jobApi.findJobsByStrings(projectId, new FindJobsByStringsParameters().setHashcodes(["hash1"]));

            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/find-jobs-by-strings`,
                sinon.match({ body: "{\"hashcodes\":[\"hash1\"]}" })
            );
        });
    });

    describe("searchJobs", () => {
        it("posts hashcodes together with the other filters", async () => {
            await jobApi.searchJobs(
                projectId,
                new SearchJobsParameters().setHashcodes(["hash1", "hash2"]).setTranslationJobUids([jobUid])
            );

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/search`,
                {
                    body: `{"hashcodes":["hash1","hash2"],"translationJobUids":["${jobUid}"]}`,
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

    describe("searchJobs response", () => {
        let responseMockTextStub;

        beforeEach(() => {
            responseMockTextStub = sinon.stub(responseMock, "text");
        });

        afterEach(() => {
            responseMockTextStub.restore();
        });

        it("keeps null fields and converts the dates", async () => {
            responseMockTextStub.returns(JSON.stringify({
                response: {
                    data: {
                        totalCount: 1,
                        items: [{
                            translationJobUid: jobUid,
                            jobName: "name",
                            jobNumber: null,
                            dueDate: null,
                            createdDate: "2026-01-15T10:00:00Z",
                            referenceNumber: null,
                            description: null,
                            rushRequest: false
                        }]
                    }
                }
            }));

            const result = await jobApi.searchJobs(projectId, new SearchJobsParameters().setHashcodes(["hash1"]));
            const [item] = result.items;

            assert.strictEqual(item.dueDate, null);
            assert.strictEqual(item.jobNumber, null);
            assert.ok(item.createdDate instanceof Date);
            assert.strictEqual(item.rushRequest, false);
        });
    });

    describe("getJobCertificates", () => {
        let responseMockTextStub;

        beforeEach(() => {
            responseMockTextStub = sinon.stub(responseMock, "text");
        });

        afterEach(() => {
            responseMockTextStub.restore();
        });

        it("gets the certificates of a job", async () => {
            responseMockTextStub.returns(
                JSON.stringify({ response: { data: { items: [], totalCount: 0 } } })
            );

            await jobApi.getJobCertificates("project/id", "job uid");

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                "https://test.com/jobs-api/v3/projects/project%2Fid/jobs/job%20uid/certificates",
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

        it("converts the dates and keeps nulls", async () => {
            responseMockTextStub.returns(JSON.stringify({
                response: {
                    data: {
                        totalCount: 3,
                        items: [
                            {
                                localeId: "de-DE",
                                localeDescription: "German (Germany)",
                                status: "COMPLETED",
                                error: null,
                                certificate: { attachmentUid: "cert1" },
                                bundle: { attachmentUid: "bundle1" },
                                createdDate: "2026-01-15T10:00:00Z",
                                completedDate: "2026-01-15T10:05:00Z"
                            },
                            {
                                localeId: "fr-FR",
                                localeDescription: null,
                                status: "IN_PROGRESS",
                                error: null,
                                certificate: { attachmentUid: null },
                                bundle: { attachmentUid: null },
                                createdDate: "2026-01-15T10:00:00Z",
                                completedDate: null
                            },
                            {
                                localeId: "es-ES",
                                localeDescription: "Spanish (Spain)",
                                status: "FAILED",
                                error: "Certified download generation failed.",
                                certificate: { attachmentUid: null },
                                bundle: { attachmentUid: null },
                                createdDate: "2026-01-15T10:00:00Z",
                                completedDate: null
                            }
                        ]
                    }
                }
            }));

            const result = await jobApi.getJobCertificates(projectId, jobUid);

            assert.strictEqual(result.items[0].status, JobCertificateStatus.COMPLETED);
            assert.ok(result.items[0].createdDate instanceof Date);
            assert.ok(result.items[0].completedDate instanceof Date);
            assert.strictEqual(result.items[1].completedDate, null);
            assert.strictEqual(result.items[1].certificate.attachmentUid, null);
            assert.strictEqual(result.items[2].status, JobCertificateStatus.FAILED);
            assert.strictEqual(result.items[2].error, "Certified download generation failed.");
        });
    });
});
