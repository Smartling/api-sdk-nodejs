import * as assert from "assert";
import { CountProjectIssuesParameters } from "../api/issues/params/count-project-issues-parameters";
import { JobFilterPresence } from "../api/issues/enums/job-filter-presence";
import { CreateIssueParameters } from "../api/issues/params/create-issue-parameters";
import { EditIssueParameters } from "../api/issues/params/edit-issue-parameters";
import { UpdateIssueAssigneeParameters } from "../api/issues/params/update-issue-assignee-parameters";
import { CreateIssueCommentParameters } from "../api/issues/params/create-issue-comment-parameters";
import { EditIssueCommentParameters } from "../api/issues/params/edit-issue-comment-parameters";
import { FindProjectIssuesParameters } from "../api/issues/params/find-project-issues-parameters";
import { FindAccountIssuesParameters } from "../api/issues/params/find-account-issues-parameters";

describe("SmartlingIssuesAPI class tests.", () => {
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
