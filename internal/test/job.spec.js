require("mocha");
const sinon = require("sinon");
const assert = require("assert");
const ListJobsParameters = require("../api/job/params/list-jobs-parameters");
const FileProgressParameters = require("../api/job/params/file-progress-parameters");
const SmartlingJobApi = require("../api/job/index");
const JobOrderEnum = require("../api/job/params/order-enum");
const { loggerMock, authMock, responseMock } = require("./mock");

const projectId = "testProjectId";
const jobUid = "testJobUid";
const fileUri = "testFileUri.json";
const sortByFieldName = "name";
const bodyParams = { sortBy: sortByFieldName, sortDirection: JobOrderEnum.ASC };

describe("SmartlingJobAPI class tests.", () => {
    let jobApi;
    let jobServiceApiFetchStub;
    let jobServiceApiUaStub;
    let responseMockJsonStub;
    let jobParameters;

    beforeEach(() => {
        jobParameters = new ListJobsParameters().setSort(sortByFieldName, JobOrderEnum.ASC);

        jobApi = new SmartlingJobApi(authMock, loggerMock, "https://test.com");
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

    describe("Params", () => {
        it("Create locale parameters", () => {
            assert.deepEqual(
                bodyParams,
                jobParameters.export()
            );
        });
    });

    describe("Methods", () => {
        it("Should search for jobs", async () => {
            await jobApi.searchJobs(projectId, jobParameters);

            sinon.assert.calledOnce(jobServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                jobServiceApiFetchStub,
                `https://test.com/jobs-api/v3/projects/${projectId}/jobs/search`,
                {
                    body: bodyParams,
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Should get job file progress", async () => {
            const fileProgressParameters = new FileProgressParameters();
            fileProgressParameters.setFileUri(fileUri);
            await jobApi.getJobFileProgress(projectId, jobUid, fileProgressParameters);

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
    });
});
