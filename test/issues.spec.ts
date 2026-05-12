import * as assert from "assert";
import { CountProjectIssuesParameters } from "../api/issues/params/count-project-issues-parameters";
import { JobFilterPresence } from "../api/issues/enums/job-filter-presence";
import { CreateIssueParameters } from "../api/issues/params/create-issue-parameters";
import { EditIssueParameters } from "../api/issues/params/edit-issue-parameters";
import { UpdateIssueAssigneeParameters } from "../api/issues/params/update-issue-assignee-parameters";

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
    });
});
