import assert from "assert";
import sinon from "sinon";
import { loggerMock, authMock, responseMock } from "./mock";
import { Order } from "../api/jobs/params/order";
import { ListJobsParameters } from "../api/jobs/params/list-jobs-parameters";
import { SmartlingJobsApi } from "../api/jobs/index";
import { FileProgressParameters } from "../api/jobs/params/file-progress-parameters";
import { SmartlingAuthApi } from "../api/auth/index";

const projectId = "testProjectId";
const jobUid = "testJobUid";
const fileUri = "testFileUri.json";
const sortByFieldName = "name";
const bodyParams = { sortBy: sortByFieldName, sortDirection: Order.ASC };

describe("SmartlingJobAPI class tests.", () => {
    let jobApi;
    let jobServiceApiFetchStub;
    let jobServiceApiUaStub;
    let responseMockJsonStub;
    let jobParameters;

    beforeEach(() => {
        jobParameters = new ListJobsParameters().setSort(sortByFieldName, Order.ASC);

        jobApi = new SmartlingJobsApi(authMock as any, loggerMock, "https://test.com");
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
