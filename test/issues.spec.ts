import * as sinon from "sinon";
import * as assert from "assert";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingIssuesApi } from "../api/issues/index";
import { SmartlingAuthApi } from "../api/auth/index";
import { IssueType } from "../api/issues/enums/issue-type";
import { IssueSubType } from "../api/issues/enums/issue-sub-type";
import { IssueSeverityLevel } from "../api/issues/enums/issue-severity-level";
import { CountProjectIssuesParameters } from "../api/issues/params/count-project-issues-parameters";
import { JobFilterPresence } from "../api/issues/enums/job-filter-presence";
import { CreateIssueParameters } from "../api/issues/params/create-issue-parameters";
import { EditIssueParameters } from "../api/issues/params/edit-issue-parameters";
import { UpdateIssueStateParameters } from "../api/issues/params/update-issue-state-parameters";
import { IssueState } from "../api/issues/enums/issue-state";
import { UpdateIssueAssigneeParameters } from "../api/issues/params/update-issue-assignee-parameters";
import { CreateIssueCommentParameters } from "../api/issues/params/create-issue-comment-parameters";
import { EditIssueCommentParameters } from "../api/issues/params/edit-issue-comment-parameters";
import { FindProjectIssuesParameters } from "../api/issues/params/find-project-issues-parameters";
import { FindAccountIssuesParameters } from "../api/issues/params/find-account-issues-parameters";
import { UpdateIssueAnsweredParameters } from "../api/issues/params/update-issue-answered-parameters";
import { UpdateIssueSeverityLevelParameters } from "../api/issues/params/update-issue-severity-level-parameters";
import { UpdateIssueTypeParameters } from "../api/issues/params/update-issue-type-parameters";
import { CountAccountIssuesParameters } from "../api/issues/params/count-account-issues-parameters";
import { IssueSortField } from "../api/issues/enums/issue-sort-field";
import { Order } from "../api/parameters/order";

describe("SmartlingIssuesAPI class tests.", () => {
    const accountUid = "testAccountUid";
    const projectId = "testProjectId";
    const issueUid = "testIssueUid";
    const issueCommentUid = "testIssueCommentUid";
    let issuesApi;
    let issuesServiceApiFetchStub;
    let issuesServiceApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        issuesApi = new SmartlingIssuesApi(
            "https://test.com",
            authMock as unknown as SmartlingAuthApi,
            loggerMock
        );
        issuesServiceApiFetchStub = sinon.stub(issuesApi, "fetch");
        issuesServiceApiUaStub = sinon.stub(issuesApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        issuesServiceApiUaStub.returns("test_user_agent");
        issuesServiceApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        issuesServiceApiFetchStub.restore();
        responseMockJsonStub.restore();
        issuesServiceApiUaStub.restore();
    });

    describe("Methods", () => {
        it("Create issue", async () => {
            const params = new CreateIssueParameters()
                .setIssueText("This translation is incorrect.")
                .setIssueType(IssueType.TRANSLATION)
                .setIssueSubType(IssueSubType.POOR_TRANSLATION)
                .setString({ hashcode: "c32c16cddafd63dfa0dc12449372a093", localeId: "ru-RU" })
                .setIssueSeverityLevel(IssueSeverityLevel.LOW);

            await issuesApi.createIssue(projectId, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues`,
                {
                    body: "{\"issueText\":\"This translation is incorrect.\",\"issueTypeCode\":\"TRANSLATION\",\"issueSubTypeCode\":\"POOR_TRANSLATION\",\"string\":{\"hashcode\":\"c32c16cddafd63dfa0dc12449372a093\",\"localeId\":\"ru-RU\"},\"issueSeverityLevelCode\":\"LOW\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Edit issue", async () => {
            const params = new EditIssueParameters().setIssueText("Edited issue text.");

            await issuesApi.editIssue(projectId, issueUid, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}/issueText`,
                {
                    body: "{\"issueText\":\"Edited issue text.\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put"
                }
            );
        });

        it("Open or close issue", async () => {
            const params = new UpdateIssueStateParameters().setIssueState(IssueState.RESOLVED);

            await issuesApi.openOrCloseIssue(projectId, issueUid, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}/state`,
                {
                    body: "{\"issueStateCode\":\"RESOLVED\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put"
                }
            );
        });

        it("Get issue details", async () => {
            await issuesApi.getIssueDetails(projectId, issueUid);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}`,
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

        it("Update issue answered", async () => {
            const params = new UpdateIssueAnsweredParameters().setAnswered(true);

            await issuesApi.updateIssueAnswered(projectId, issueUid, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}/answered`,
                {
                    body: "{\"answered\":true}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put"
                }
            );
        });

        it("Update issue assignee", async () => {
            const params = new UpdateIssueAssigneeParameters().setAssigneeUserUid("661801f19693");

            await issuesApi.updateIssueAssignee(projectId, issueUid, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}/assignee`,
                {
                    body: "{\"assigneeUserUid\":\"661801f19693\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put"
                }
            );
        });

        it("Delete issue assignee", async () => {
            await issuesApi.deleteIssueAssignee(projectId, issueUid);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}/assignee`,
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

        it("Update issue severity level", async () => {
            const params = new UpdateIssueSeverityLevelParameters()
                .setIssueSeverityLevel(IssueSeverityLevel.HIGH);

            await issuesApi.updateIssueSeverityLevel(projectId, issueUid, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}/severity-level`,
                {
                    body: "{\"issueSeverityLevelCode\":\"HIGH\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put"
                }
            );
        });

        it("Update issue type", async () => {
            const params = new UpdateIssueTypeParameters()
                .setIssueType(IssueType.TRANSLATION)
                .setIssueSubType(IssueSubType.POOR_TRANSLATION)
                .setLocaleId("ru-RU");

            await issuesApi.updateIssueType(projectId, issueUid, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}/change-type`,
                {
                    body: "{\"issueTypeCode\":\"TRANSLATION\",\"issueSubTypeCode\":\"POOR_TRANSLATION\",\"localeId\":\"ru-RU\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put"
                }
            );
        });

        it("Get issue comments", async () => {
            await issuesApi.getIssueComments(projectId, issueUid);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}/comments`,
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

        it("Add issue comment", async () => {
            const params = new CreateIssueCommentParameters().setCommentText("Looks good.");

            await issuesApi.addIssueComment(projectId, issueUid, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}/comments`,
                {
                    body: "{\"commentText\":\"Looks good.\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Update issue comment", async () => {
            const params = new EditIssueCommentParameters().setCommentText("Updated comment.");

            await issuesApi.updateIssueComment(projectId, issueUid, issueCommentUid, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}/comments/${issueCommentUid}`,
                {
                    body: "{\"commentText\":\"Updated comment.\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Get issue comment details", async () => {
            await issuesApi.getIssueCommentDetails(projectId, issueUid, issueCommentUid);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}/comments/${issueCommentUid}`,
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

        it("Delete issue comment", async () => {
            await issuesApi.deleteIssueComment(projectId, issueUid, issueCommentUid);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/${issueUid}/comments/${issueCommentUid}`,
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

        it("Find project issues", async () => {
            const params = new FindProjectIssuesParameters()
                .setIssueTypeCodes([IssueType.TRANSLATION])
                .setIssueStateCodes([IssueState.OPENED])
                .setLimit(50)
                .setOffset(0)
                .setSortBy({
                    items: [{ direction: Order.DESC, fieldName: IssueSortField.CREATED_DATE }]
                });

            await issuesApi.findProjectIssues(projectId, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/list`,
                {
                    body: "{\"issueTypeCodes\":[\"TRANSLATION\"],\"issueStateCodes\":[\"OPENED\"],\"limit\":50,\"offset\":0,\"sortBy\":{\"items\":[{\"direction\":\"DESC\",\"fieldName\":\"createdDate\"}]}}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Count project issues", async () => {
            const params = new CountProjectIssuesParameters()
                .setIssueStateCodes([IssueState.OPENED, IssueState.RESOLVED]);

            await issuesApi.countProjectIssues(projectId, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/projects/${projectId}/issues/count`,
                {
                    body: "{\"issueStateCodes\":[\"OPENED\",\"RESOLVED\"]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Find account issues", async () => {
            const params = new FindAccountIssuesParameters()
                .setProjectIds(["project1", "project2"])
                .setIssueTypeCodes([IssueType.SOURCE])
                .setLimit(30)
                .setOffset(0);

            await issuesApi.findAccountIssues(accountUid, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/accounts/${accountUid}/issues/list`,
                {
                    body: "{\"projectIds\":[\"project1\",\"project2\"],\"issueTypeCodes\":[\"SOURCE\"],\"limit\":30,\"offset\":0}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Count account issues", async () => {
            const params = new CountAccountIssuesParameters()
                .setProjectIds(["project1"])
                .setAnswered(false);

            await issuesApi.countAccountIssues(accountUid, params);

            sinon.assert.calledOnce(issuesServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                issuesServiceApiFetchStub,
                `https://test.com/issues-api/v2/accounts/${accountUid}/issues/count`,
                {
                    body: "{\"projectIds\":[\"project1\"],\"answered\":false}",
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

    describe("Parameter validation", () => {
        it("BaseIssuesFilterParameters should validate issueNumbers limit", () => {
            const params = new CountProjectIssuesParameters();
            const tooManyNumbers = Array(1001).fill(1);

            try {
                params.setIssueNumbers(tooManyNumbers);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Issue numbers array must not exceed 1000 items");
            }
        });

        it("BaseIssuesFilterParameters should validate jobFilter jobUids limit", () => {
            const params = new CountProjectIssuesParameters();
            const tooManyUids = Array(1001).fill("uid");

            try {
                params.setJobFilter({ jobUids: tooManyUids, presence: JobFilterPresence.HAS_ANY });
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Job filter jobUids array must not exceed 1000 items");
            }
        });

        it("CreateIssueParameters should validate issueText length", () => {
            const params = new CreateIssueParameters();
            const tooLong = "a".repeat(4001);

            try {
                params.setIssueText(tooLong);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Issue text length must not exceed 4000 characters");
            }
        });

        it("EditIssueParameters should validate issueText length", () => {
            const params = new EditIssueParameters();
            const tooLong = "a".repeat(4001);

            try {
                params.setIssueText(tooLong);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Issue text length must not exceed 4000 characters");
            }
        });

        it("UpdateIssueAssigneeParameters should reject empty assigneeUserUid", () => {
            const params = new UpdateIssueAssigneeParameters();

            try {
                params.setAssigneeUserUid("");
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "assigneeUserUid is required");
            }
        });

        it("CreateIssueCommentParameters should validate commentText length", () => {
            const params = new CreateIssueCommentParameters();
            const tooLong = "a".repeat(4001);

            try {
                params.setCommentText(tooLong);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Comment text length must not exceed 4000 characters");
            }
        });

        it("EditIssueCommentParameters should validate commentText length", () => {
            const params = new EditIssueCommentParameters();
            const tooLong = "a".repeat(4001);

            try {
                params.setCommentText(tooLong);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Comment text length must not exceed 4000 characters");
            }
        });

        it("FindProjectIssuesParameters should validate limit is non-negative", () => {
            const params = new FindProjectIssuesParameters();

            try {
                params.setLimit(-1);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Limit must be non-negative");
            }
        });

        it("FindProjectIssuesParameters should validate offset is non-negative", () => {
            const params = new FindProjectIssuesParameters();

            try {
                params.setOffset(-1);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Offset must be non-negative");
            }
        });

        it("FindAccountIssuesParameters should validate limit is non-negative", () => {
            const params = new FindAccountIssuesParameters();

            try {
                params.setLimit(-1);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Limit must be non-negative");
            }
        });

        it("FindAccountIssuesParameters should validate offset is non-negative", () => {
            const params = new FindAccountIssuesParameters();

            try {
                params.setOffset(-1);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Offset must be non-negative");
            }
        });
    });
});
