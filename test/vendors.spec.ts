import sinon from "sinon";
import assert from "assert";
import { SmartlingVendorsApi } from "../api/vendors";
import { SmartlingAuthApi } from "../api/auth/index";
import { WorkflowStepType } from "../api/vendors/dto/workflow-step-type";
import { loggerMock, authMock, responseMock } from "./mock";

describe("SmartlingVendorsApi class tests.", () => {
    let vendorsApi;
    let vendorsApiFetchStub;
    let vendorsApiUaStub;
    let responseMockTextStub;

    beforeEach(() => {
        vendorsApi = new SmartlingVendorsApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);

        vendorsApiFetchStub = sinon.stub(vendorsApi, "fetch");
        vendorsApiUaStub = sinon.stub(vendorsApi, "ua");
        responseMockTextStub = sinon.stub(responseMock, "text");

        vendorsApiUaStub.returns("test_user_agent");
        vendorsApiFetchStub.returns(responseMock);
        responseMockTextStub.returns("{\"response\": {\"data\": {\"items\": []}}}");
    });

    afterEach(() => {
        vendorsApiFetchStub.restore();
        responseMockTextStub.restore();
        vendorsApiUaStub.restore();
    });

    it("Get content assignments by account", async () => {
        await vendorsApi.getContentAssignmentsByAccount("test_account");

        sinon.assert.calledOnce(vendorsApiFetchStub);
        sinon.assert.calledWithExactly(
            vendorsApiFetchStub,
            "https://test.com/vendors-api/v2/accounts/test_account/content-assignments",
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

    it("Parses due date fields as Date instances", async () => {
        responseMockTextStub.returns(JSON.stringify({
            response: {
                data: {
                    items: [{
                        accountUid: "a1",
                        accountName: "A",
                        projectUid: "p1",
                        projectName: "P",
                        localeId: "es-ES",
                        workflowUid: "w1",
                        workflowName: "W",
                        workflowStepUid: "ws1",
                        workflowStepName: "Translation",
                        workflowStepType: "TRANSLATION",
                        translationJobUid: "j1",
                        translationJobName: "J",
                        translationJobWorkflowStepDueDate: "2025-01-20T18:01:00Z",
                        translationJobOverallDueDate: "2025-01-21T18:01:00Z",
                        userUid: null,
                        userFirstName: null,
                        userLastName: null,
                        userEmail: null,
                        agencyUid: null,
                        agencyName: null,
                        wordCount: 300,
                        workflowStepOrder: 2,
                        assignmentEnabled: false
                    }]
                }
            }
        }));

        const result = await vendorsApi.getContentAssignmentsByAccount("test_account");
        const item = result.items[0];

        assert.ok(item.translationJobWorkflowStepDueDate instanceof Date);
        assert.equal(item.translationJobWorkflowStepDueDate.toISOString(), "2025-01-20T18:01:00.000Z");
        assert.ok(item.translationJobOverallDueDate instanceof Date);
        assert.equal(item.translationJobOverallDueDate.toISOString(), "2025-01-21T18:01:00.000Z");
        assert.equal(item.workflowStepType, WorkflowStepType.TRANSLATION);
    });

    it("Preserves null user and agency fields", async () => {
        responseMockTextStub.returns(JSON.stringify({
            response: {
                data: {
                    items: [{
                        accountUid: "a1",
                        accountName: "A",
                        projectUid: "p1",
                        projectName: "P",
                        localeId: "es-ES",
                        workflowUid: "w1",
                        workflowName: "W",
                        workflowStepUid: "ws1",
                        workflowStepName: "Translation",
                        workflowStepType: "TRANSLATION",
                        translationJobUid: "j1",
                        translationJobName: "J",
                        translationJobWorkflowStepDueDate: "2025-01-20T18:01:00Z",
                        translationJobOverallDueDate: "2025-01-21T18:01:00Z",
                        userUid: null,
                        userFirstName: null,
                        userLastName: null,
                        userEmail: null,
                        agencyUid: null,
                        agencyName: null,
                        wordCount: 0,
                        workflowStepOrder: 1,
                        assignmentEnabled: true
                    }]
                }
            }
        }));

        const result = await vendorsApi.getContentAssignmentsByAccount("test_account");
        const item = result.items[0];

        assert.strictEqual(item.userUid, null);
        assert.strictEqual(item.userFirstName, null);
        assert.strictEqual(item.userLastName, null);
        assert.strictEqual(item.userEmail, null);
        assert.strictEqual(item.agencyUid, null);
        assert.strictEqual(item.agencyName, null);
    });
});
