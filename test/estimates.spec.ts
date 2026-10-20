import sinon from "sinon";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingEstimatesApi } from "../api/estimates/index";
import { SmartlingAuthApi } from "../api/auth/index";
import { ListJobEstimateReportsParameters } from "../api/estimates/params/list-job-estimate-reports-parameters";
import { GenerateJobEstimateReportParameters } from "../api/estimates/params/generate-job-estimate-report-parameters";
import { ModifyEstimateReportTagsParameters } from "../api/estimates/params/modify-estimate-report-tags-parameters";
import { EstimateReportStatus } from "../api/estimates/params/estimate-report-status";
import { EstimateReportContentCoverage } from "../api/estimates/params/estimate-report-content-coverage";
import { JobContentType } from "../api/estimates/params/job-content-type";

describe("SmartlingEstimatesApi class tests.", () => {
    const projectId = "testProjectId";
    const translationJobUid = "testJobUid";
    const reportUid = "testReportUid";
    let estimatesApi;
    let estimatesApiFetchStub;
    let estimatesApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        estimatesApi = new SmartlingEstimatesApi(
            "https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock
        );
        estimatesApiFetchStub = sinon.stub(estimatesApi, "fetch");
        estimatesApiUaStub = sinon.stub(estimatesApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        estimatesApiUaStub.returns("test_user_agent");
        estimatesApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        estimatesApiFetchStub.restore();
        responseMockJsonStub.restore();
        estimatesApiUaStub.restore();
    });

    describe("Methods", () => {
        it("Get job fuzzy estimate reports", async () => {
            const params = new ListJobEstimateReportsParameters()
                .setReportStatus(EstimateReportStatus.COMPLETED)
                .setContentCoverage(EstimateReportContentCoverage.FULL)
                .setCreatorUserUids(["creatorUserUid1"])
                .setTranslationJobSchemaContents([JobContentType.ALL_CONTENT])
                .setTags(["tag1", "tag2"])
                .setCreatedFrom(new Date("2020-01-01T00:00:00.000Z"))
                .setCreatedTo(new Date("2020-02-01T00:00:00.000Z"))
                .setLimit(100)
                .setOffset(10);

            await estimatesApi.getJobFuzzyEstimateReports(projectId, translationJobUid, params);

            sinon.assert.calledOnce(estimatesApiFetchStub);
            sinon.assert.calledWithExactly(
                estimatesApiFetchStub,
                `https://test.com/estimates-api/v2/projects/${projectId}/jobs/${translationJobUid}/reports/fuzzy?reportStatus=COMPLETED&contentCoverage=FULL&creatorUserUids=creatorUserUid1&translationJobSchemaContents=ALL_CONTENT&tags=tag1&tags=tag2&createdFrom=2020-01-01T00%3A00%3A00Z&createdTo=2020-02-01T00%3A00%3A00Z&limit=100&offset=10`,
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

        it("Generate job fuzzy estimate report", async () => {
            const params = new GenerateJobEstimateReportParameters()
                .setContentType(JobContentType.ALL_CONTENT)
                .setTags(["tag1"])
                .setLocaleWorkflowStepsFilter([
                    { targetLocaleId: "es-CR", workflowStepUid: "9358c9ed8748" }
                ]);

            await estimatesApi.generateJobFuzzyEstimateReport(projectId, translationJobUid, params);

            sinon.assert.calledOnce(estimatesApiFetchStub);
            sinon.assert.calledWithExactly(
                estimatesApiFetchStub,
                `https://test.com/estimates-api/v2/projects/${projectId}/jobs/${translationJobUid}/reports/fuzzy`,
                {
                    body: "{\"contentType\":\"ALL_CONTENT\",\"tags\":[\"tag1\"],\"localeWorkflowStepsFilter\":[{\"targetLocaleId\":\"es-CR\",\"workflowStepUid\":\"9358c9ed8748\"}]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Get job cost estimate reports", async () => {
            const params = new ListJobEstimateReportsParameters()
                .setLimit(50)
                .setOffset(0);

            await estimatesApi.getJobCostEstimateReports(projectId, translationJobUid, params);

            sinon.assert.calledOnce(estimatesApiFetchStub);
            sinon.assert.calledWithExactly(
                estimatesApiFetchStub,
                `https://test.com/estimates-api/v2/projects/${projectId}/jobs/${translationJobUid}/reports/cost?limit=50&offset=0`,
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

        it("Generate job cost estimate report", async () => {
            const params = new GenerateJobEstimateReportParameters()
                .setContentType(JobContentType.UNAUTHORIZED)
                .setTags(["tag1", "tag2"])
                .setLocaleWorkflows([{ targetLocaleId: "en-FR", workflowUid: "783d9d255523" }])
                .setFuzzyProfileUid("uid123456")
                .setRushRequest(true)
                .setLocaleWorkflowStepsFilter([
                    { targetLocaleId: "es-CR", workflowStepUid: "9358c9ed8748" }
                ]);

            await estimatesApi.generateJobCostEstimateReport(projectId, translationJobUid, params);

            sinon.assert.calledOnce(estimatesApiFetchStub);
            sinon.assert.calledWithExactly(
                estimatesApiFetchStub,
                `https://test.com/estimates-api/v2/projects/${projectId}/jobs/${translationJobUid}/reports/cost`,
                {
                    body: "{\"contentType\":\"UNAUTHORIZED\",\"tags\":[\"tag1\",\"tag2\"],\"localeWorkflows\":[{\"targetLocaleId\":\"en-FR\",\"workflowUid\":\"783d9d255523\"}],\"fuzzyProfileUid\":\"uid123456\",\"rushRequest\":true,\"localeWorkflowStepsFilter\":[{\"targetLocaleId\":\"es-CR\",\"workflowStepUid\":\"9358c9ed8748\"}]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Get estimate report", async () => {
            await estimatesApi.getEstimateReport(projectId, reportUid);

            sinon.assert.calledOnce(estimatesApiFetchStub);
            sinon.assert.calledWithExactly(
                estimatesApiFetchStub,
                `https://test.com/estimates-api/v2/projects/${projectId}/reports/${reportUid}`,
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

        it("Delete estimate report", async () => {
            await estimatesApi.deleteEstimateReport(projectId, reportUid);

            sinon.assert.calledOnce(estimatesApiFetchStub);
            sinon.assert.calledWithExactly(
                estimatesApiFetchStub,
                `https://test.com/estimates-api/v2/projects/${projectId}/reports/${reportUid}`,
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

        it("Get estimate report status", async () => {
            await estimatesApi.getEstimateReportStatus(projectId, reportUid);

            sinon.assert.calledOnce(estimatesApiFetchStub);
            sinon.assert.calledWithExactly(
                estimatesApiFetchStub,
                `https://test.com/estimates-api/v2/projects/${projectId}/reports/${reportUid}/status`,
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

        it("Modify estimate report tags", async () => {
            const params = new ModifyEstimateReportTagsParameters().setTags(["AdminJob", "NEWTAG1"]);

            await estimatesApi.modifyEstimateReportTags(projectId, reportUid, params);

            sinon.assert.calledOnce(estimatesApiFetchStub);
            sinon.assert.calledWithExactly(
                estimatesApiFetchStub,
                `https://test.com/estimates-api/v2/projects/${projectId}/reports/${reportUid}/tags`,
                {
                    body: "{\"tags\":[\"AdminJob\",\"NEWTAG1\"]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put"
                }
            );
        });

        it("Download estimate report", async () => {
            await estimatesApi.downloadEstimateReport(projectId, reportUid);

            sinon.assert.calledOnce(estimatesApiFetchStub);
            sinon.assert.calledWithExactly(
                estimatesApiFetchStub,
                `https://test.com/estimates-api/v2/projects/${projectId}/reports/${reportUid}/download?format=csv`,
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
