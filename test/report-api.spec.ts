import sinon from "sinon";
import assert from "assert";
import { SmartlingReportServiceApi } from "../api/reports";
import { WordCountParameters } from "../api/reports/params/word-count-parameters";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingAuthApi } from "../api/auth";

describe("SmartlingReportServiceApi class tests.", () => {
    let reportServiceApi: SmartlingReportServiceApi;
    let reportServiceApiFetchStub: sinon.SinonStub;
    let reportServiceApiUaStub: sinon.SinonStub;
    let responseMockTextStub: sinon.SinonStub;

    beforeEach(() => {
        reportServiceApi = new SmartlingReportServiceApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);

        reportServiceApiFetchStub = sinon.stub(reportServiceApi, "fetch");
        reportServiceApiUaStub = sinon.stub(reportServiceApi, "ua");
        responseMockTextStub = sinon.stub(responseMock, "text");

        reportServiceApiUaStub.returns("test_user_agent");
        reportServiceApiFetchStub.returns(responseMock);
    });

    afterEach(() => {
        reportServiceApiFetchStub.restore();
        responseMockTextStub.restore();
        reportServiceApiUaStub.restore();
    });

    function smartlingResponse(body: unknown) {
        return {
            response: {
                code: "SUCCESS",
                data: body
            }
        };
    }

    describe("getWorkflowStepTypes", () => {
        it("Should call correct endpoint and return workflow step types", async () => {
            const payload = {
                resultsTruncated: false,
                items: [
                    { workflowStepType: "TRANSLATION" },
                    { workflowStepType: "REVIEW" },
                    { workflowStepType: "APPROVAL" }
                ]
            };
            const mockResponse = smartlingResponse(payload);

            responseMockTextStub.returns(JSON.stringify(mockResponse));

            const result = await reportServiceApi.getWorkflowStepTypes();

            sinon.assert.calledOnce(reportServiceApiFetchStub);
            const callArgs = reportServiceApiFetchStub.getCall(0).args;

            assert.strictEqual(callArgs[0], "https://test.com/reports-api/v3/word-count/dictionary/step-types");
            assert.strictEqual(callArgs[1].method, "GET");
            assert.deepStrictEqual(callArgs[1].headers, {
                Authorization: "test_token_type test_access_token",
                "Content-Type": "application/json",
                "User-Agent": "test_user_agent"
            });

            assert.deepStrictEqual(result, payload);
        });
    });

    describe("getWordsCountReport", () => {
        it("Should call correct endpoint with parameters", async () => {
            const payload = {
                resultsTruncated: false,
                items: [
                    {
                        accountUid: "account123",
                        accountName: "Test Account",
                        projectUid: "project123",
                        projectName: "Test Project",
                        jobUid: "job123",
                        jobName: "Test Job",
                        translationResourceUid: "resource123",
                        translationResourceName: "Test Resource",
                        agencyUid: "agency123",
                        agencyName: "Test Agency",
                        targetLocale: "es-ES",
                        workflowStepType: "TRANSLATION",
                        fuzzyProfileName: "Standard",
                        fuzzyTier: "100%",
                        wordCount: 1000,
                        weightedWordCount: 950
                    }
                ]
            };
            const mockResponse = smartlingResponse(payload);

            responseMockTextStub.returns(JSON.stringify(mockResponse));

            const startDate = new Date("2024-01-01T00:00:00Z");
            const endDate = new Date("2024-12-31T23:59:59Z");

            const params = new WordCountParameters()
                .setStartDate(startDate)
                .setEndDate(endDate)
                .setAccountUid("account123")
                .setProjectIds(["project123"])
                .setUserUids(["user123"])
                .setAgencyUid("agency123")
                .setJobUids(["job123"])
                .setTargetLocaleIds(["fr-FR"])
                .setWorkflowStepTypes(["TRANSLATION", "REVIEW"])
                .setFields("includeTranslationResource,includeJob,includeFuzzyMatchProfile")
                .setLimit(100)
                .setOffset(0);

            const result = await reportServiceApi.getWordsCountReport(params);

            sinon.assert.calledOnce(reportServiceApiFetchStub);
            const callArgs = reportServiceApiFetchStub.getCall(0).args;

            assert.strictEqual(callArgs[0], "https://test.com/reports-api/v3/word-count"
                + "?startDate=2024-01-01"
                + "&endDate=2024-12-31"
                + "&accountUid=account123"
                + "&projectIds=project123"
                + "&userUids=user123"
                + "&agencyUid=agency123"
                + "&jobUids=job123"
                + "&targetLocaleIds=fr-FR"
                + "&workflowStepTypes=TRANSLATION"
                + "&workflowStepTypes=REVIEW"
                + "&fields=includeTranslationResource%2CincludeJob%2CincludeFuzzyMatchProfile"
                + "&limit=100"
                + "&offset=0");
            assert.strictEqual(callArgs[1].method, "GET");
            assert.deepStrictEqual(callArgs[1].headers, {
                Authorization: "test_token_type test_access_token",
                "Content-Type": "application/json",
                "User-Agent": "test_user_agent"
            });

            assert.deepStrictEqual(result, payload);
        });
    });

    describe("getWordsCountReportCsv", () => {
        it("Should call CSV endpoint and return CSV string", async () => {
            const csvResponse = `projectId,projectName,targetLocaleId,jobUid,jobName,translationResourceName,workflowStepType,wordCount,characterCount
project123,Test Project,es-ES,job123,Test Job,Test Resource,TRANSLATION,1000,5000
project123,Test Project,fr-FR,job456,Another Job,Another Resource,REVIEW,500,2500`;

            responseMockTextStub.returns(csvResponse);

            const startDate = new Date("2024-01-01T00:00:00Z");
            const endDate = new Date("2024-12-31T23:59:59Z");

            const params = new WordCountParameters()
                .setStartDate(startDate)
                .setEndDate(endDate)
                .setAccountUid("account123")
                .setProjectIds(["project123"])
                .setUserUids(["user123"])
                .setAgencyUid("agency123")
                .setJobUids(["job123"])
                .setTargetLocaleIds(["fr-FR"])
                .setWorkflowStepTypes(["TRANSLATION", "REVIEW"])
                .setFields("projectId,projectName,targetLocaleId,jobUid,jobName,translationResourceName,workflowStepType,wordCount,characterCount")
                .setLimit(100)
                .setOffset(0);

            const result = await reportServiceApi.getWordsCountReportCsv(params);

            sinon.assert.calledOnce(reportServiceApiFetchStub);
            const callArgs = reportServiceApiFetchStub.getCall(0).args;

            assert.strictEqual(callArgs[0], "https://test.com/reports-api/v3/word-count/csv"
                + "?startDate=2024-01-01"
                + "&endDate=2024-12-31"
                + "&accountUid=account123"
                + "&projectIds=project123"
                + "&userUids=user123"
                + "&agencyUid=agency123"
                + "&jobUids=job123"
                + "&targetLocaleIds=fr-FR"
                + "&workflowStepTypes=TRANSLATION"
                + "&workflowStepTypes=REVIEW"
                + "&fields=projectId%2CprojectName%2CtargetLocaleId%2CjobUid%2CjobName%2CtranslationResourceName%2CworkflowStepType%2CwordCount%2CcharacterCount"
                + "&limit=100"
                + "&offset=0");
            assert.strictEqual(callArgs[1].method, "GET");
            assert.deepStrictEqual(callArgs[1].headers, {
                Authorization: "test_token_type test_access_token",
                "Content-Type": "application/json",
                "User-Agent": "test_user_agent"
            });

            assert.strictEqual(result, csvResponse);
        });
    });
});
