# Issues API Client Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `SmartlingIssuesApi` covering 18 Smartling Issues v2 endpoints, mirroring the existing `SmartlingTagsApi` pattern (parameter builders, DTO interfaces, root re-exports, sinon-stubbed unit tests).

**Architecture:** New `api/issues/` feature module with `enums/`, `dto/`, and `params/` subfolders. A flat F-bounded generic base (`BaseIssuesFilterParameters<T>`) backs the four find/count parameter classes; all other parameter classes are standalone. The API client extends `SmartlingBaseApi`, dispatches via `makeRequest`, and is exercised by `test/issues.spec.ts` (stubs on `fetch`, `ua`, and `responseMock.json` — same as `test/tags.spec.ts`).

**Tech Stack:** TypeScript 4.9, Mocha, Sinon, ESLint (Airbnb + project rules: 4-space indent, double quotes, no trailing commas). Build via `npm run build:dev`; test via `npm run test:dev`; lint via `npm run pretest`.

**Spec:** `docs/superpowers/specs/2026-05-12-issues-api-client-design.md`

---

## Conventions used in this plan

- All file paths are absolute under `/Users/fluffy/Work/Projects/sdk/api-sdk-nodejs`.
- Every code block uses 4-space indent, double quotes, no trailing commas (project ESLint).
- Test invocations use `npm run test:dev` (which runs `build:dev` first, then mocha on compiled output).
- After every implementation step, run `npm run pretest && npm run test:dev` and require both to succeed before committing.
- Commits use Conventional Commits: `feat(issues): ...`. Each task ends with a commit.

---

## Task 1: Create the seven enum files

**Files:**
- Create: `api/issues/enums/issue-type.ts`
- Create: `api/issues/enums/issue-sub-type.ts`
- Create: `api/issues/enums/issue-severity-level.ts`
- Create: `api/issues/enums/issue-state.ts`
- Create: `api/issues/enums/issue-watching-state.ts`
- Create: `api/issues/enums/job-filter-presence.ts`
- Create: `api/issues/enums/issue-sort-field.ts`

- [ ] **Step 1: Create `issue-type.ts`**

```ts
export enum IssueType {
    SOURCE = "SOURCE",
    TRANSLATION = "TRANSLATION"
}
```

- [ ] **Step 2: Create `issue-sub-type.ts`**

```ts
export enum IssueSubType {
    CLARIFICATION = "CLARIFICATION",
    MISSPELLING = "MISSPELLING",
    POOR_TRANSLATION = "POOR_TRANSLATION",
    DOES_NOT_FIT_SPACE = "DOES_NOT_FIT_SPACE",
    PLACEHOLDER_ISSUE = "PLACEHOLDER_ISSUE",
    REVIEW_TRANSLATION = "REVIEW_TRANSLATION",
    CUSTOM = "CUSTOM",
    MT_ERROR = "MT_ERROR"
}
```

- [ ] **Step 3: Create `issue-severity-level.ts`**

```ts
export enum IssueSeverityLevel {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}
```

- [ ] **Step 4: Create `issue-state.ts`**

```ts
export enum IssueState {
    OPENED = "OPENED",
    RESOLVED = "RESOLVED"
}
```

- [ ] **Step 5: Create `issue-watching-state.ts`**

```ts
export enum IssueWatchingState {
    WATCHING = "WATCHING",
    NOT_WATCHING = "NOT_WATCHING"
}
```

- [ ] **Step 6: Create `job-filter-presence.ts`**

```ts
export enum JobFilterPresence {
    HAS_ANY = "HAS_ANY",
    HAS_NOTHING = "HAS_NOTHING"
}
```

- [ ] **Step 7: Create `issue-sort-field.ts`**

```ts
export enum IssueSortField {
    ISSUE_TYPE_CODE = "issueTypeCode",
    ISSUE_SUB_TYPE_CODE = "issueSubTypeCode",
    ISSUE_STATE_CODE = "issueStateCode",
    CREATED_DATE = "createdDate",
    RESOLVED_DATE = "resolvedDate",
    HASHCODE = "hashcode",
    ISSUE_TEXT = "issueText",
    ISSUE_TEXT_MODIFIED_DATE = "issueTextModifiedDate",
    RESOLVED_BY_USER_UID = "resolvedByUserUid",
    REPORTED_BY_USER_UID = "reportedByUserUid",
    ASSIGNEE_USER_UID = "assigneeUserUid",
    LAST_COMMENT_DATE = "lastCommentDate"
}
```

- [ ] **Step 8: Verify build**

Run: `npm run build:dev`
Expected: succeeds (no errors). The new files compile.

- [ ] **Step 9: Commit**

```bash
git add api/issues/enums/
git commit -m "feat(issues): add issue enums"
```

---

## Task 2: Create the fourteen DTO interfaces

**Files:**
- Create: `api/issues/dto/issue-string-dto.ts`
- Create: `api/issues/dto/issue-dto.ts`
- Create: `api/issues/dto/issue-text-dto.ts`
- Create: `api/issues/dto/issue-state-dto.ts`
- Create: `api/issues/dto/issue-answered-dto.ts`
- Create: `api/issues/dto/issue-assignee-dto.ts`
- Create: `api/issues/dto/issue-severity-level-dto.ts`
- Create: `api/issues/dto/issue-changed-type-dto.ts`
- Create: `api/issues/dto/issue-comment-dto.ts`
- Create: `api/issues/dto/issues-count-dto.ts`
- Create: `api/issues/dto/string-filter-dto.ts`
- Create: `api/issues/dto/job-filter-dto.ts`
- Create: `api/issues/dto/issue-sort-item-dto.ts`
- Create: `api/issues/dto/issue-sort-by-dto.ts`

- [ ] **Step 1: Create `issue-string-dto.ts`**

```ts
export interface IssueStringDto {
    hashcode: string;
    localeId?: string;
}
```

- [ ] **Step 2: Create `issue-dto.ts`**

```ts
import { IssueSeverityLevel } from "../enums/issue-severity-level";
import { IssueState } from "../enums/issue-state";
import { IssueSubType } from "../enums/issue-sub-type";
import { IssueType } from "../enums/issue-type";
import { IssueStringDto } from "./issue-string-dto";

export interface IssueDto {
    answered: boolean;
    createdDate: string;
    lastCommentDate?: string;
    issueSeverityLevelCode: IssueSeverityLevel;
    issueStateCode: IssueState;
    issueSubTypeCode: IssueSubType;
    issueText: string;
    issueTextModifiedDate?: string;
    issueTypeCode: IssueType;
    issueUid: string;
    projectId: string;
    accountUid: string;
    issueNumber: number;
    reportedByUserUid: string;
    resolvedByUserUid?: string;
    assigneeUserUid?: string;
    resolvedDate?: string;
    reopened: boolean;
    reopenedByUserUid?: string;
    reopenedDate?: string;
    string: IssueStringDto;
    issueCommentsCount: number;
}
```

- [ ] **Step 3: Create `issue-text-dto.ts`**

```ts
export interface IssueTextDto {
    issueText: string;
    issueTextModifiedDate: string;
}
```

- [ ] **Step 4: Create `issue-state-dto.ts`**

```ts
import { IssueState } from "../enums/issue-state";

export interface IssueStateDto {
    issueStateCode: IssueState;
    reopened: boolean;
}
```

- [ ] **Step 5: Create `issue-answered-dto.ts`**

```ts
export interface IssueAnsweredDto {
    answered: boolean;
}
```

- [ ] **Step 6: Create `issue-assignee-dto.ts`**

```ts
export interface IssueAssigneeDto {
    assigneeUserUid: string;
}
```

- [ ] **Step 7: Create `issue-severity-level-dto.ts`**

```ts
import { IssueSeverityLevel } from "../enums/issue-severity-level";

export interface IssueSeverityLevelDto {
    issueSeverityLevelCode: IssueSeverityLevel;
}
```

- [ ] **Step 8: Create `issue-changed-type-dto.ts`**

```ts
import { IssueSubType } from "../enums/issue-sub-type";
import { IssueType } from "../enums/issue-type";

export interface IssueChangedTypeDto {
    issueTypeCode: IssueType;
    issueSubTypeCode: IssueSubType;
    localeId?: string;
}
```

- [ ] **Step 9: Create `issue-comment-dto.ts`**

```ts
export interface IssueCommentDto {
    commentText: string;
    commentTextModifiedDate?: string;
    createdByUserUid: string;
    createdDate: string;
    issueCommentUid: string;
}
```

- [ ] **Step 10: Create `issues-count-dto.ts`**

```ts
export interface IssuesCountDto {
    count: number;
}
```

- [ ] **Step 11: Create `string-filter-dto.ts`**

```ts
export interface StringFilterDto {
    hashcodes?: Array<string>;
    localeIds?: Array<string>;
}
```

- [ ] **Step 12: Create `job-filter-dto.ts`**

```ts
import { JobFilterPresence } from "../enums/job-filter-presence";

export interface JobFilterDto {
    jobUids?: Array<string>;
    presence?: JobFilterPresence;
}
```

- [ ] **Step 13: Create `issue-sort-item-dto.ts`**

```ts
import { Order } from "../../parameters/order";
import { IssueSortField } from "../enums/issue-sort-field";

export interface IssueSortItemDto {
    direction: Order;
    fieldName: IssueSortField;
}
```

- [ ] **Step 14: Create `issue-sort-by-dto.ts`**

```ts
import { IssueSortItemDto } from "./issue-sort-item-dto";

export interface IssueSortByDto {
    items: Array<IssueSortItemDto>;
}
```

- [ ] **Step 15: Verify build**

Run: `npm run build:dev`
Expected: succeeds.

- [ ] **Step 16: Commit**

```bash
git add api/issues/dto/
git commit -m "feat(issues): add issue and comment DTO interfaces"
```

---

## Task 3: BaseIssuesFilterParameters and validation tests

`BaseIssuesFilterParameters<T>` is the shared filter base. We bootstrap `test/issues.spec.ts` here with the standard stub block and add the validation tests that exercise the base via `FindProjectIssuesParameters` — except the concrete classes don't exist yet. To keep the TDD loop tight, we test the abstract base via a temporary concrete subclass defined inside the spec.

Actually — to avoid noise, we'll create a placeholder `CountProjectIssuesParameters` in this task (just `extends BaseIssuesFilterParameters<CountProjectIssuesParameters> {}`) and exercise the base through it. Task 8 fleshes out the rest of the find/count classes.

**Files:**
- Create: `api/issues/params/base-issues-filter-parameters.ts`
- Create: `api/issues/params/count-project-issues-parameters.ts`
- Create: `test/issues.spec.ts`

- [ ] **Step 1: Write failing tests** in `test/issues.spec.ts`

```ts
import * as sinon from "sinon";
import * as assert from "assert";
import { loggerMock, authMock, responseMock } from "./mock";
import { CountProjectIssuesParameters } from "../api/issues/params/count-project-issues-parameters";
import { JobFilterPresence } from "../api/issues/enums/job-filter-presence";

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
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:dev`
Expected: FAIL — module `../api/issues/params/count-project-issues-parameters` cannot be resolved.

- [ ] **Step 3: Create `base-issues-filter-parameters.ts`**

```ts
import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";
import { IssueSeverityLevel } from "../enums/issue-severity-level";
import { IssueState } from "../enums/issue-state";
import { IssueSubType } from "../enums/issue-sub-type";
import { IssueType } from "../enums/issue-type";
import { IssueWatchingState } from "../enums/issue-watching-state";
import { JobFilterDto } from "../dto/job-filter-dto";
import { StringFilterDto } from "../dto/string-filter-dto";

export abstract class BaseIssuesFilterParameters<
    T extends BaseIssuesFilterParameters<T>
> extends BaseParameters {
    setCreatedDateBefore(date: string): T {
        this.set("createdDateBefore", date);
        return this as unknown as T;
    }

    setCreatedDateAfter(date: string): T {
        this.set("createdDateAfter", date);
        return this as unknown as T;
    }

    setResolvedDateBefore(date: string): T {
        this.set("resolvedDateBefore", date);
        return this as unknown as T;
    }

    setResolvedDateAfter(date: string): T {
        this.set("resolvedDateAfter", date);
        return this as unknown as T;
    }

    setAnswered(answered: boolean): T {
        this.set("answered", answered);
        return this as unknown as T;
    }

    setReopened(reopened: boolean): T {
        this.set("reopened", reopened);
        return this as unknown as T;
    }

    setHasComments(hasComments: boolean): T {
        this.set("hasComments", hasComments);
        return this as unknown as T;
    }

    setIssueSeverityLevelCodes(codes: Array<IssueSeverityLevel>): T {
        this.set("issueSeverityLevelCodes", codes);
        return this as unknown as T;
    }

    setIssueStateCodes(codes: Array<IssueState>): T {
        this.set("issueStateCodes", codes);
        return this as unknown as T;
    }

    setIssueSubTypeCodes(codes: Array<IssueSubType>): T {
        this.set("issueSubTypeCodes", codes);
        return this as unknown as T;
    }

    setIssueTypeCodes(codes: Array<IssueType>): T {
        this.set("issueTypeCodes", codes);
        return this as unknown as T;
    }

    setIssueWatchingStateCode(code: IssueWatchingState): T {
        this.set("issueWatchingStateCode", code);
        return this as unknown as T;
    }

    setReportedByUserUid(uid: string): T {
        this.set("reportedByUserUid", uid);
        return this as unknown as T;
    }

    setAssigneeUserUid(uid: string): T {
        this.set("assigneeUserUid", uid);
        return this as unknown as T;
    }

    setIssueNumbers(numbers: Array<number>): T {
        if (numbers && numbers.length > 1000) {
            throw new SmartlingException("Issue numbers array must not exceed 1000 items");
        }
        this.set("issueNumbers", numbers);
        return this as unknown as T;
    }

    setJobFilter(jobFilter: JobFilterDto): T {
        if (jobFilter && jobFilter.jobUids && jobFilter.jobUids.length > 1000) {
            throw new SmartlingException("Job filter jobUids array must not exceed 1000 items");
        }
        this.set("jobFilter", jobFilter);
        return this as unknown as T;
    }

    setStringFilter(stringFilter: StringFilterDto): T {
        this.set("stringFilter", stringFilter);
        return this as unknown as T;
    }
}
```

- [ ] **Step 4: Create `count-project-issues-parameters.ts`**

```ts
import { BaseIssuesFilterParameters } from "./base-issues-filter-parameters";

export class CountProjectIssuesParameters
    extends BaseIssuesFilterParameters<CountProjectIssuesParameters> {}
```

- [ ] **Step 5: Run lint and tests to verify they pass**

Run: `npm run pretest && npm run test:dev`
Expected: lint clean, mocha shows both validation tests passing.

- [ ] **Step 6: Commit**

```bash
git add api/issues/params/base-issues-filter-parameters.ts api/issues/params/count-project-issues-parameters.ts test/issues.spec.ts
git commit -m "feat(issues): add BaseIssuesFilterParameters and CountProjectIssuesParameters with validation"
```

---

## Task 4: Issue lifecycle parameter classes

Adds the seven issue-attribute parameter classes: `CreateIssueParameters`, `EditIssueParameters`, `UpdateIssueStateParameters`, `UpdateIssueAnsweredParameters`, `UpdateIssueAssigneeParameters`, `UpdateIssueSeverityLevelParameters`, `UpdateIssueTypeParameters`.

**Files:**
- Create: `api/issues/params/create-issue-parameters.ts`
- Create: `api/issues/params/edit-issue-parameters.ts`
- Create: `api/issues/params/update-issue-state-parameters.ts`
- Create: `api/issues/params/update-issue-answered-parameters.ts`
- Create: `api/issues/params/update-issue-assignee-parameters.ts`
- Create: `api/issues/params/update-issue-severity-level-parameters.ts`
- Create: `api/issues/params/update-issue-type-parameters.ts`
- Modify: `test/issues.spec.ts` (add validation tests)

- [ ] **Step 1: Add failing validation tests** to the existing `describe("Parameter validation", ...)` block in `test/issues.spec.ts`

Add these new imports at the top of the file:

```ts
import { CreateIssueParameters } from "../api/issues/params/create-issue-parameters";
import { EditIssueParameters } from "../api/issues/params/edit-issue-parameters";
import { UpdateIssueAssigneeParameters } from "../api/issues/params/update-issue-assignee-parameters";
import { IssueType } from "../api/issues/enums/issue-type";
import { IssueSubType } from "../api/issues/enums/issue-sub-type";
```

Add these `it` blocks inside `describe("Parameter validation", ...)`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:dev`
Expected: FAIL — modules cannot be resolved.

- [ ] **Step 3: Create `create-issue-parameters.ts`**

```ts
import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";
import { IssueSeverityLevel } from "../enums/issue-severity-level";
import { IssueSubType } from "../enums/issue-sub-type";
import { IssueType } from "../enums/issue-type";
import { IssueStringDto } from "../dto/issue-string-dto";

export class CreateIssueParameters extends BaseParameters {
    setIssueText(issueText: string): CreateIssueParameters {
        if (issueText && issueText.length > 4000) {
            throw new SmartlingException("Issue text length must not exceed 4000 characters");
        }
        this.set("issueText", issueText);
        return this;
    }

    setIssueType(issueType: IssueType): CreateIssueParameters {
        this.set("issueTypeCode", issueType);
        return this;
    }

    setIssueSubType(issueSubType: IssueSubType): CreateIssueParameters {
        this.set("issueSubTypeCode", issueSubType);
        return this;
    }

    setString(string: IssueStringDto): CreateIssueParameters {
        this.set("string", string);
        return this;
    }

    setAssigneeUserUid(assigneeUserUid: string): CreateIssueParameters {
        this.set("assigneeUserUid", assigneeUserUid);
        return this;
    }

    setIssueSeverityLevel(level: IssueSeverityLevel): CreateIssueParameters {
        this.set("issueSeverityLevelCode", level);
        return this;
    }
}
```

- [ ] **Step 4: Create `edit-issue-parameters.ts`**

```ts
import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

export class EditIssueParameters extends BaseParameters {
    setIssueText(issueText: string): EditIssueParameters {
        if (issueText && issueText.length > 4000) {
            throw new SmartlingException("Issue text length must not exceed 4000 characters");
        }
        this.set("issueText", issueText);
        return this;
    }
}
```

- [ ] **Step 5: Create `update-issue-state-parameters.ts`**

```ts
import { BaseParameters } from "../../parameters/index";
import { IssueState } from "../enums/issue-state";

export class UpdateIssueStateParameters extends BaseParameters {
    setIssueState(state: IssueState): UpdateIssueStateParameters {
        this.set("issueStateCode", state);
        return this;
    }
}
```

- [ ] **Step 6: Create `update-issue-answered-parameters.ts`**

```ts
import { BaseParameters } from "../../parameters/index";

export class UpdateIssueAnsweredParameters extends BaseParameters {
    setAnswered(answered: boolean): UpdateIssueAnsweredParameters {
        this.set("answered", answered);
        return this;
    }
}
```

- [ ] **Step 7: Create `update-issue-assignee-parameters.ts`**

```ts
import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

export class UpdateIssueAssigneeParameters extends BaseParameters {
    setAssigneeUserUid(assigneeUserUid: string): UpdateIssueAssigneeParameters {
        if (!assigneeUserUid || assigneeUserUid.length === 0) {
            throw new SmartlingException("assigneeUserUid is required");
        }
        this.set("assigneeUserUid", assigneeUserUid);
        return this;
    }
}
```

- [ ] **Step 8: Create `update-issue-severity-level-parameters.ts`**

```ts
import { BaseParameters } from "../../parameters/index";
import { IssueSeverityLevel } from "../enums/issue-severity-level";

export class UpdateIssueSeverityLevelParameters extends BaseParameters {
    setIssueSeverityLevel(level: IssueSeverityLevel): UpdateIssueSeverityLevelParameters {
        this.set("issueSeverityLevelCode", level);
        return this;
    }
}
```

- [ ] **Step 9: Create `update-issue-type-parameters.ts`**

```ts
import { BaseParameters } from "../../parameters/index";
import { IssueSubType } from "../enums/issue-sub-type";
import { IssueType } from "../enums/issue-type";

export class UpdateIssueTypeParameters extends BaseParameters {
    setIssueType(issueType: IssueType): UpdateIssueTypeParameters {
        this.set("issueTypeCode", issueType);
        return this;
    }

    setIssueSubType(issueSubType: IssueSubType): UpdateIssueTypeParameters {
        this.set("issueSubTypeCode", issueSubType);
        return this;
    }

    setLocaleId(localeId: string): UpdateIssueTypeParameters {
        this.set("localeId", localeId);
        return this;
    }
}
```

- [ ] **Step 10: Run lint and tests**

Run: `npm run pretest && npm run test:dev`
Expected: lint clean; the three new validation tests pass (5 total in Parameter validation).

- [ ] **Step 11: Commit**

```bash
git add api/issues/params/create-issue-parameters.ts api/issues/params/edit-issue-parameters.ts api/issues/params/update-issue-state-parameters.ts api/issues/params/update-issue-answered-parameters.ts api/issues/params/update-issue-assignee-parameters.ts api/issues/params/update-issue-severity-level-parameters.ts api/issues/params/update-issue-type-parameters.ts test/issues.spec.ts
git commit -m "feat(issues): add issue lifecycle parameter classes"
```

---

## Task 5: Comment parameter classes

`CreateIssueCommentParameters` and `EditIssueCommentParameters`. Both validate commentText length ≤ 4000.

**Files:**
- Create: `api/issues/params/create-issue-comment-parameters.ts`
- Create: `api/issues/params/edit-issue-comment-parameters.ts`
- Modify: `test/issues.spec.ts`

- [ ] **Step 1: Add failing tests** — append to `test/issues.spec.ts` imports and `Parameter validation` block

Add imports near the top:

```ts
import { CreateIssueCommentParameters } from "../api/issues/params/create-issue-comment-parameters";
import { EditIssueCommentParameters } from "../api/issues/params/edit-issue-comment-parameters";
```

Add `it` blocks inside `describe("Parameter validation", ...)`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:dev`
Expected: FAIL — modules cannot be resolved.

- [ ] **Step 3: Create `create-issue-comment-parameters.ts`**

```ts
import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

export class CreateIssueCommentParameters extends BaseParameters {
    setCommentText(commentText: string): CreateIssueCommentParameters {
        if (commentText && commentText.length > 4000) {
            throw new SmartlingException("Comment text length must not exceed 4000 characters");
        }
        this.set("commentText", commentText);
        return this;
    }
}
```

- [ ] **Step 4: Create `edit-issue-comment-parameters.ts`**

```ts
import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

export class EditIssueCommentParameters extends BaseParameters {
    setCommentText(commentText: string): EditIssueCommentParameters {
        if (commentText && commentText.length > 4000) {
            throw new SmartlingException("Comment text length must not exceed 4000 characters");
        }
        this.set("commentText", commentText);
        return this;
    }
}
```

- [ ] **Step 5: Run lint and tests**

Run: `npm run pretest && npm run test:dev`
Expected: lint clean; both new validation tests pass.

- [ ] **Step 6: Commit**

```bash
git add api/issues/params/create-issue-comment-parameters.ts api/issues/params/edit-issue-comment-parameters.ts test/issues.spec.ts
git commit -m "feat(issues): add comment parameter classes"
```

---

## Task 6: Find/Count parameter classes

`FindProjectIssuesParameters`, `CountAccountIssuesParameters`, `FindAccountIssuesParameters` — all flat from the base. Adds `limit/offset/sortBy` validation tests.

**Files:**
- Create: `api/issues/params/find-project-issues-parameters.ts`
- Create: `api/issues/params/count-account-issues-parameters.ts`
- Create: `api/issues/params/find-account-issues-parameters.ts`
- Modify: `test/issues.spec.ts`

- [ ] **Step 1: Add failing tests** — append to imports and `Parameter validation`

Add imports:

```ts
import { FindProjectIssuesParameters } from "../api/issues/params/find-project-issues-parameters";
import { FindAccountIssuesParameters } from "../api/issues/params/find-account-issues-parameters";
```

Add `it` blocks inside `describe("Parameter validation", ...)`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:dev`
Expected: FAIL — modules cannot be resolved.

- [ ] **Step 3: Create `find-project-issues-parameters.ts`**

```ts
import { BaseIssuesFilterParameters } from "./base-issues-filter-parameters";
import { SmartlingException } from "../../exception/index";
import { IssueSortByDto } from "../dto/issue-sort-by-dto";

export class FindProjectIssuesParameters
    extends BaseIssuesFilterParameters<FindProjectIssuesParameters> {
    setLimit(limit: number): FindProjectIssuesParameters {
        if (limit < 0) {
            throw new SmartlingException("Limit must be non-negative");
        }
        this.set("limit", limit);
        return this;
    }

    setOffset(offset: number): FindProjectIssuesParameters {
        if (offset < 0) {
            throw new SmartlingException("Offset must be non-negative");
        }
        this.set("offset", offset);
        return this;
    }

    setSortBy(sortBy: IssueSortByDto): FindProjectIssuesParameters {
        this.set("sortBy", sortBy);
        return this;
    }
}
```

- [ ] **Step 4: Create `count-account-issues-parameters.ts`**

```ts
import { BaseIssuesFilterParameters } from "./base-issues-filter-parameters";

export class CountAccountIssuesParameters
    extends BaseIssuesFilterParameters<CountAccountIssuesParameters> {
    setProjectIds(projectIds: Array<string>): CountAccountIssuesParameters {
        this.set("projectIds", projectIds);
        return this;
    }
}
```

- [ ] **Step 5: Create `find-account-issues-parameters.ts`**

```ts
import { BaseIssuesFilterParameters } from "./base-issues-filter-parameters";
import { SmartlingException } from "../../exception/index";
import { IssueSortByDto } from "../dto/issue-sort-by-dto";

export class FindAccountIssuesParameters
    extends BaseIssuesFilterParameters<FindAccountIssuesParameters> {
    setProjectIds(projectIds: Array<string>): FindAccountIssuesParameters {
        this.set("projectIds", projectIds);
        return this;
    }

    setLimit(limit: number): FindAccountIssuesParameters {
        if (limit < 0) {
            throw new SmartlingException("Limit must be non-negative");
        }
        this.set("limit", limit);
        return this;
    }

    setOffset(offset: number): FindAccountIssuesParameters {
        if (offset < 0) {
            throw new SmartlingException("Offset must be non-negative");
        }
        this.set("offset", offset);
        return this;
    }

    setSortBy(sortBy: IssueSortByDto): FindAccountIssuesParameters {
        this.set("sortBy", sortBy);
        return this;
    }
}
```

- [ ] **Step 6: Run lint and tests**

Run: `npm run pretest && npm run test:dev`
Expected: lint clean; the four new validation tests pass.

- [ ] **Step 7: Commit**

```bash
git add api/issues/params/find-project-issues-parameters.ts api/issues/params/count-account-issues-parameters.ts api/issues/params/find-account-issues-parameters.ts test/issues.spec.ts
git commit -m "feat(issues): add find/count parameter classes"
```

---

## Task 7: SmartlingIssuesApi skeleton + createIssue

**Files:**
- Create: `api/issues/index.ts`
- Modify: `test/issues.spec.ts` (add Methods block, add createIssue test)

- [ ] **Step 1: Add Methods scaffold + createIssue failing test** to `test/issues.spec.ts`

Add imports near the top:

```ts
import { SmartlingIssuesApi } from "../api/issues/index";
import { SmartlingAuthApi } from "../api/auth/index";
import { IssueSeverityLevel } from "../api/issues/enums/issue-severity-level";
```

Add new top-level setup (inside the outer `describe("SmartlingIssuesAPI class tests.", ...)`, before the existing `Parameter validation` describe):

```ts
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:dev`
Expected: FAIL — `../api/issues/index` cannot be resolved.

- [ ] **Step 3: Create `api/issues/index.ts` with skeleton + createIssue**

```ts
import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { CreateIssueParameters } from "./params/create-issue-parameters";
import { IssueDto } from "./dto/issue-dto";

export class SmartlingIssuesApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/issues-api/v2`;
    }

    async createIssue(
        projectId: string,
        params: CreateIssueParameters
    ): Promise<IssueDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/issues`,
            JSON.stringify(params.export())
        );
    }
}
```

- [ ] **Step 4: Run lint and tests**

Run: `npm run pretest && npm run test:dev`
Expected: lint clean; `Create issue` test passes alongside all earlier tests.

- [ ] **Step 5: Commit**

```bash
git add api/issues/index.ts test/issues.spec.ts
git commit -m "feat(issues): add SmartlingIssuesApi skeleton and createIssue"
```

---

## Task 8: editIssue, openOrCloseIssue, getIssueDetails

**Files:**
- Modify: `api/issues/index.ts`
- Modify: `test/issues.spec.ts`

- [ ] **Step 1: Add failing tests** to the existing `describe("Methods", ...)` block

Add imports:

```ts
import { EditIssueParameters } from "../api/issues/params/edit-issue-parameters";
import { UpdateIssueStateParameters } from "../api/issues/params/update-issue-state-parameters";
import { IssueState } from "../api/issues/enums/issue-state";
```

Add `it` blocks:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:dev`
Expected: FAIL — methods undefined.

- [ ] **Step 3: Add methods to `api/issues/index.ts`**

Add new imports at top of the file:

```ts
import { EditIssueParameters } from "./params/edit-issue-parameters";
import { UpdateIssueStateParameters } from "./params/update-issue-state-parameters";
import { IssueTextDto } from "./dto/issue-text-dto";
import { IssueStateDto } from "./dto/issue-state-dto";
```

Append methods to the class body:

```ts
async editIssue(
    projectId: string,
    issueUid: string,
    params: EditIssueParameters
): Promise<IssueTextDto> {
    return await this.makeRequest(
        "put",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/issueText`,
        JSON.stringify(params.export())
    );
}

async openOrCloseIssue(
    projectId: string,
    issueUid: string,
    params: UpdateIssueStateParameters
): Promise<IssueStateDto> {
    return await this.makeRequest(
        "put",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/state`,
        JSON.stringify(params.export())
    );
}

async getIssueDetails(
    projectId: string,
    issueUid: string
): Promise<IssueDto> {
    return await this.makeRequest(
        "get",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}`
    );
}
```

- [ ] **Step 4: Run lint and tests**

Run: `npm run pretest && npm run test:dev`
Expected: lint clean; all four Methods tests pass.

- [ ] **Step 5: Commit**

```bash
git add api/issues/index.ts test/issues.spec.ts
git commit -m "feat(issues): add editIssue, openOrCloseIssue, getIssueDetails"
```

---

## Task 9: Issue attribute updates (answered, assignee, severity, type)

Five methods: `updateIssueAnswered`, `updateIssueAssignee`, `deleteIssueAssignee`, `updateIssueSeverityLevel`, `updateIssueType`.

**Files:**
- Modify: `api/issues/index.ts`
- Modify: `test/issues.spec.ts`

- [ ] **Step 1: Add failing tests**

Add imports:

```ts
import { UpdateIssueAnsweredParameters } from "../api/issues/params/update-issue-answered-parameters";
import { UpdateIssueSeverityLevelParameters } from "../api/issues/params/update-issue-severity-level-parameters";
import { UpdateIssueTypeParameters } from "../api/issues/params/update-issue-type-parameters";
```

Add `it` blocks:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:dev`
Expected: FAIL.

- [ ] **Step 3: Add methods to `api/issues/index.ts`**

Add imports:

```ts
import { UpdateIssueAnsweredParameters } from "./params/update-issue-answered-parameters";
import { UpdateIssueAssigneeParameters } from "./params/update-issue-assignee-parameters";
import { UpdateIssueSeverityLevelParameters } from "./params/update-issue-severity-level-parameters";
import { UpdateIssueTypeParameters } from "./params/update-issue-type-parameters";
import { IssueAnsweredDto } from "./dto/issue-answered-dto";
import { IssueAssigneeDto } from "./dto/issue-assignee-dto";
import { IssueSeverityLevelDto } from "./dto/issue-severity-level-dto";
import { IssueChangedTypeDto } from "./dto/issue-changed-type-dto";
```

Append methods:

```ts
async updateIssueAnswered(
    projectId: string,
    issueUid: string,
    params: UpdateIssueAnsweredParameters
): Promise<IssueAnsweredDto> {
    return await this.makeRequest(
        "put",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/answered`,
        JSON.stringify(params.export())
    );
}

async updateIssueAssignee(
    projectId: string,
    issueUid: string,
    params: UpdateIssueAssigneeParameters
): Promise<IssueAssigneeDto> {
    return await this.makeRequest(
        "put",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/assignee`,
        JSON.stringify(params.export())
    );
}

async deleteIssueAssignee(
    projectId: string,
    issueUid: string
): Promise<void> {
    await this.makeRequest(
        "delete",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/assignee`
    );
}

async updateIssueSeverityLevel(
    projectId: string,
    issueUid: string,
    params: UpdateIssueSeverityLevelParameters
): Promise<IssueSeverityLevelDto> {
    return await this.makeRequest(
        "put",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/severity-level`,
        JSON.stringify(params.export())
    );
}

async updateIssueType(
    projectId: string,
    issueUid: string,
    params: UpdateIssueTypeParameters
): Promise<IssueChangedTypeDto> {
    return await this.makeRequest(
        "put",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/change-type`,
        JSON.stringify(params.export())
    );
}
```

- [ ] **Step 4: Run lint and tests**

Run: `npm run pretest && npm run test:dev`
Expected: lint clean; all attribute-update tests pass.

- [ ] **Step 5: Commit**

```bash
git add api/issues/index.ts test/issues.spec.ts
git commit -m "feat(issues): add issue attribute update endpoints"
```

---

## Task 10: Comment endpoints

Five methods: `getIssueComments`, `addIssueComment`, `updateIssueComment` (POST!), `getIssueCommentDetails`, `deleteIssueComment`.

**Files:**
- Modify: `api/issues/index.ts`
- Modify: `test/issues.spec.ts`

- [ ] **Step 1: Add failing tests**

Add `it` blocks (no new imports needed — comment params imports were added in Task 5):

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:dev`
Expected: FAIL.

- [ ] **Step 3: Add methods to `api/issues/index.ts`**

Add imports:

```ts
import { CreateIssueCommentParameters } from "./params/create-issue-comment-parameters";
import { EditIssueCommentParameters } from "./params/edit-issue-comment-parameters";
import { IssueCommentDto } from "./dto/issue-comment-dto";
import { SmartlingListResponse } from "../http/smartling-list-response";
```

Append methods:

```ts
async getIssueComments(
    projectId: string,
    issueUid: string
): Promise<SmartlingListResponse<IssueCommentDto>> {
    return await this.makeRequest(
        "get",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/comments`
    );
}

async addIssueComment(
    projectId: string,
    issueUid: string,
    params: CreateIssueCommentParameters
): Promise<IssueCommentDto> {
    return await this.makeRequest(
        "post",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/comments`,
        JSON.stringify(params.export())
    );
}

async updateIssueComment(
    projectId: string,
    issueUid: string,
    issueCommentUid: string,
    params: EditIssueCommentParameters
): Promise<IssueCommentDto> {
    return await this.makeRequest(
        "post",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/comments/${issueCommentUid}`,
        JSON.stringify(params.export())
    );
}

async getIssueCommentDetails(
    projectId: string,
    issueUid: string,
    issueCommentUid: string
): Promise<IssueCommentDto> {
    return await this.makeRequest(
        "get",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/comments/${issueCommentUid}`
    );
}

async deleteIssueComment(
    projectId: string,
    issueUid: string,
    issueCommentUid: string
): Promise<void> {
    await this.makeRequest(
        "delete",
        `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/comments/${issueCommentUid}`
    );
}
```

> **Note:** `updateIssueComment` uses `POST`, not `PUT`. This matches the official swagger and is intentional.

- [ ] **Step 4: Run lint and tests**

Run: `npm run pretest && npm run test:dev`
Expected: lint clean; all comment tests pass.

- [ ] **Step 5: Commit**

```bash
git add api/issues/index.ts test/issues.spec.ts
git commit -m "feat(issues): add comment endpoints"
```

---

## Task 11: Find/Count endpoints

Four methods: `findProjectIssues`, `countProjectIssues`, `findAccountIssues`, `countAccountIssues`.

**Files:**
- Modify: `api/issues/index.ts`
- Modify: `test/issues.spec.ts`

- [ ] **Step 1: Add failing tests**

Add imports:

```ts
import { CountAccountIssuesParameters } from "../api/issues/params/count-account-issues-parameters";
import { IssueSortField } from "../api/issues/enums/issue-sort-field";
import { Order } from "../api/parameters/order";
```

Add `it` blocks:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:dev`
Expected: FAIL.

- [ ] **Step 3: Add methods to `api/issues/index.ts`**

Add imports:

```ts
import { CountProjectIssuesParameters } from "./params/count-project-issues-parameters";
import { FindProjectIssuesParameters } from "./params/find-project-issues-parameters";
import { CountAccountIssuesParameters } from "./params/count-account-issues-parameters";
import { FindAccountIssuesParameters } from "./params/find-account-issues-parameters";
import { IssuesCountDto } from "./dto/issues-count-dto";
```

Append methods:

```ts
async findProjectIssues(
    projectId: string,
    params: FindProjectIssuesParameters
): Promise<SmartlingListResponse<IssueDto>> {
    return await this.makeRequest(
        "post",
        `${this.entrypoint}/projects/${projectId}/issues/list`,
        JSON.stringify(params.export())
    );
}

async countProjectIssues(
    projectId: string,
    params: CountProjectIssuesParameters
): Promise<IssuesCountDto> {
    return await this.makeRequest(
        "post",
        `${this.entrypoint}/projects/${projectId}/issues/count`,
        JSON.stringify(params.export())
    );
}

async findAccountIssues(
    accountUid: string,
    params: FindAccountIssuesParameters
): Promise<SmartlingListResponse<IssueDto>> {
    return await this.makeRequest(
        "post",
        `${this.entrypoint}/accounts/${accountUid}/issues/list`,
        JSON.stringify(params.export())
    );
}

async countAccountIssues(
    accountUid: string,
    params: CountAccountIssuesParameters
): Promise<IssuesCountDto> {
    return await this.makeRequest(
        "post",
        `${this.entrypoint}/accounts/${accountUid}/issues/count`,
        JSON.stringify(params.export())
    );
}
```

- [ ] **Step 4: Run lint and tests**

Run: `npm run pretest && npm run test:dev`
Expected: lint clean; all find/count tests pass — total of 18 Methods tests.

- [ ] **Step 5: Commit**

```bash
git add api/issues/index.ts test/issues.spec.ts
git commit -m "feat(issues): add find and count endpoints"
```

---

## Task 12: Edge case tests

Boundary tests that confirm setters accept the maximum allowed values.

**Files:**
- Modify: `test/issues.spec.ts`

- [ ] **Step 1: Add Edge cases describe block**

Append inside the outer `describe("SmartlingIssuesAPI class tests.", ...)`:

```ts
describe("Edge cases", () => {
    it("Should accept maximum issueText length", () => {
        const params = new CreateIssueParameters();
        const maxText = "a".repeat(4000);
        params.setIssueText(maxText);
        assert.equal(params.export().issueText, maxText);
    });

    it("Should accept maximum commentText length", () => {
        const params = new CreateIssueCommentParameters();
        const maxText = "a".repeat(4000);
        params.setCommentText(maxText);
        assert.equal(params.export().commentText, maxText);
    });

    it("Should accept maximum issue numbers", () => {
        const params = new CountProjectIssuesParameters();
        const maxNumbers = Array(1000).fill(1);
        params.setIssueNumbers(maxNumbers);
        assert.deepStrictEqual(params.export().issueNumbers, maxNumbers);
    });

    it("Should accept maximum jobUids in jobFilter", () => {
        const params = new CountProjectIssuesParameters();
        const maxUids = Array(1000).fill("uid");
        params.setJobFilter({ jobUids: maxUids, presence: JobFilterPresence.HAS_ANY });
        assert.deepStrictEqual(params.export().jobFilter.jobUids, maxUids);
    });

    it("Should accept zero limit and offset", () => {
        const params = new FindProjectIssuesParameters();
        params.setLimit(0).setOffset(0);
        assert.equal(params.export().limit, 0);
        assert.equal(params.export().offset, 0);
    });
});
```

- [ ] **Step 2: Run lint and tests**

Run: `npm run pretest && npm run test:dev`
Expected: lint clean; all 5 edge case tests pass alongside everything else.

- [ ] **Step 3: Commit**

```bash
git add test/issues.spec.ts
git commit -m "test(issues): add edge case tests for boundary values"
```

---

## Task 13: Root exports

Add 30+ export lines to the root `index.ts` so consumers can import from `smartling-api-sdk-nodejs` directly.

**Files:**
- Modify: `index.ts` (root)

- [ ] **Step 1: Append exports to root `index.ts`**

Append after the existing `./api/vendors/...` block (the file currently ends with `./api/vendors/dto/workflow-step-type` on line 185):

```ts
export * from "./api/issues/index";
export * from "./api/issues/enums/issue-type";
export * from "./api/issues/enums/issue-sub-type";
export * from "./api/issues/enums/issue-severity-level";
export * from "./api/issues/enums/issue-state";
export * from "./api/issues/enums/issue-watching-state";
export * from "./api/issues/enums/job-filter-presence";
export * from "./api/issues/enums/issue-sort-field";
export * from "./api/issues/dto/issue-dto";
export * from "./api/issues/dto/issue-string-dto";
export * from "./api/issues/dto/issue-text-dto";
export * from "./api/issues/dto/issue-state-dto";
export * from "./api/issues/dto/issue-answered-dto";
export * from "./api/issues/dto/issue-assignee-dto";
export * from "./api/issues/dto/issue-severity-level-dto";
export * from "./api/issues/dto/issue-changed-type-dto";
export * from "./api/issues/dto/issue-comment-dto";
export * from "./api/issues/dto/issues-count-dto";
export * from "./api/issues/dto/string-filter-dto";
export * from "./api/issues/dto/job-filter-dto";
export * from "./api/issues/dto/issue-sort-item-dto";
export * from "./api/issues/dto/issue-sort-by-dto";
export * from "./api/issues/params/base-issues-filter-parameters";
export * from "./api/issues/params/create-issue-parameters";
export * from "./api/issues/params/edit-issue-parameters";
export * from "./api/issues/params/update-issue-state-parameters";
export * from "./api/issues/params/update-issue-answered-parameters";
export * from "./api/issues/params/update-issue-assignee-parameters";
export * from "./api/issues/params/update-issue-severity-level-parameters";
export * from "./api/issues/params/update-issue-type-parameters";
export * from "./api/issues/params/create-issue-comment-parameters";
export * from "./api/issues/params/edit-issue-comment-parameters";
export * from "./api/issues/params/count-project-issues-parameters";
export * from "./api/issues/params/find-project-issues-parameters";
export * from "./api/issues/params/count-account-issues-parameters";
export * from "./api/issues/params/find-account-issues-parameters";
```

- [ ] **Step 2: Run lint and full test/build**

Run: `npm run pretest && npm run test:dev`
Expected: lint clean; full test suite still passes (the new exports don't affect existing tests but they must compile).

- [ ] **Step 3: Commit**

```bash
git add index.ts
git commit -m "feat(issues): export issues API from root index"
```

---

## Task 14: Final validation

End-to-end verification: build, lint, full test suite. Confirms no regressions in existing tests.

- [ ] **Step 1: Clean build**

Run: `npm run build:dev`
Expected: succeeds with no errors.

- [ ] **Step 2: Lint full project**

Run: `npm run pretest`
Expected: exits 0 with no errors.

- [ ] **Step 3: Run full test suite**

Run: `npm run test:dev`
Expected: all existing tests pass AND the new `SmartlingIssuesAPI class tests.` suite shows:
- Methods: 18 passing
- Parameter validation: 9 passing (2 base + 3 lifecycle + 2 comments + 4 find/count limit-offset rules — wait, count again below)
- Edge cases: 5 passing

Total new tests: 18 + 9 + 5 = 32.

Where the 9 validation tests come from:
- BaseIssuesFilterParameters: setIssueNumbers limit, setJobFilter jobUids limit (2)
- CreateIssueParameters: issueText length (1)
- EditIssueParameters: issueText length (1)
- UpdateIssueAssigneeParameters: empty assigneeUserUid (1)
- CreateIssueCommentParameters: commentText length (1)
- EditIssueCommentParameters: commentText length (1)
- FindProjectIssuesParameters: negative limit, negative offset (2 — combined into 2 separate `it`s as written)
- FindAccountIssuesParameters: negative limit, negative offset (2)

That's 11 validation tests. Final tally: 18 + 11 + 5 = 34 new tests in this suite.

- [ ] **Step 4: Verify no regressions**

Confirm `tags.spec.ts`, `jobs.spec.ts`, and all other pre-existing specs still pass (mocha output should show 0 failures total).

- [ ] **Step 5: Final commit (only if anything uncommitted)**

```bash
git status
```

If clean, no commit needed. The work is complete.

---

## Spec coverage map

| Spec section | Task(s) |
|---|---|
| Enums (§ Enums) | Task 1 |
| DTOs (§ DTOs) | Task 2 |
| BaseIssuesFilterParameters + flat hierarchy (§ Parameter classes) | Tasks 3, 6 |
| Per-operation parameters — issue lifecycle (§ Parameter classes) | Task 4 |
| Per-operation parameters — comments | Task 5 |
| Validation rules (§ Validation rules) | Tasks 3, 4, 5, 6 |
| SmartlingIssuesApi constructor + 18 endpoints (§ Endpoint mapping) | Tasks 7–11 |
| POST-for-updateIssueComment quirk | Task 10 (verb explicitly `post`) |
| Tests — Methods × 18 (§ Tests) | Tasks 7–11 |
| Tests — Parameter validation (§ Tests) | Tasks 3, 4, 5, 6 |
| Tests — Edge cases (§ Tests) | Task 12 |
| Root exports (§ Root exports) | Task 13 |
| Builder integration (§ Builder integration) | No-op — builder is generic |
| Out-of-scope (watchers, dictionary endpoints) | Not implemented (per spec) |
