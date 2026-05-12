# Issues API client — design

**Date:** 2026-05-12
**Status:** Approved
**Scope:** Add a `SmartlingIssuesApi` client to `api-sdk-nodejs` covering 18 endpoints from the Smartling Issues API v2, matching the existing patterns established by `SmartlingTagsApi` and tested in `test/tags.spec.ts`.

## Goals

- Cover the 18 Issues endpoints listed below with idiomatic SDK methods.
- Match the existing SDK conventions exactly: file layout, parameter-builder pattern, setter-side validation, DTO interfaces, root re-exports, and unit-test style (stubbed `fetch`/`ua` with `sinon.assert.calledWithExactly`).
- Introduce the seven enums the API defines (and reuse `Order` for sort direction).

## Non-goals

- Watchers endpoints (`.../watchers`, `.../watchers/{watcherUid}`).
- Issue-type / sub-type / severity-level / state dictionary endpoints under `/dictionary/...` and `/accounts/{accountUid}/issue-types/...`.
- Cross-field validation between `issueTypeCode` and `issueSubTypeCode` (the API allows `CUSTOM`, and the server is authoritative).
- Date/`Date`-object handling — the SDK uses ISO 8601 strings throughout, matching `search-jobs-parameters.ts` and `date-filter-dto.ts`.

## Endpoint mapping

`entrypoint = ${baseUrl}/issues-api/v2`

| SDK method | HTTP | Path | Returns |
|---|---|---|---|
| `createIssue(projectId, params)` | POST | `/projects/{projectId}/issues` | `IssueDto` |
| `editIssue(projectId, issueUid, params)` | PUT | `/projects/{projectId}/issues/{issueUid}/issueText` | `IssueTextDto` |
| `openOrCloseIssue(projectId, issueUid, params)` | PUT | `/projects/{projectId}/issues/{issueUid}/state` | `IssueStateDto` |
| `getIssueDetails(projectId, issueUid)` | GET | `/projects/{projectId}/issues/{issueUid}` | `IssueDto` |
| `updateIssueAnswered(projectId, issueUid, params)` | PUT | `/projects/{projectId}/issues/{issueUid}/answered` | `IssueAnsweredDto` |
| `updateIssueAssignee(projectId, issueUid, params)` | PUT | `/projects/{projectId}/issues/{issueUid}/assignee` | `IssueAssigneeDto` |
| `deleteIssueAssignee(projectId, issueUid)` | DELETE | `/projects/{projectId}/issues/{issueUid}/assignee` | `void` |
| `updateIssueSeverityLevel(projectId, issueUid, params)` | PUT | `/projects/{projectId}/issues/{issueUid}/severity-level` | `IssueSeverityLevelDto` |
| `updateIssueType(projectId, issueUid, params)` | PUT | `/projects/{projectId}/issues/{issueUid}/change-type` | `IssueChangedTypeDto` |
| `getIssueComments(projectId, issueUid)` | GET | `/projects/{projectId}/issues/{issueUid}/comments` | `SmartlingListResponse<IssueCommentDto>` |
| `addIssueComment(projectId, issueUid, params)` | POST | `/projects/{projectId}/issues/{issueUid}/comments` | `IssueCommentDto` |
| `updateIssueComment(projectId, issueUid, issueCommentUid, params)` | **POST** | `/projects/{projectId}/issues/{issueUid}/comments/{issueCommentUid}` | `IssueCommentDto` |
| `getIssueCommentDetails(projectId, issueUid, issueCommentUid)` | GET | `/projects/{projectId}/issues/{issueUid}/comments/{issueCommentUid}` | `IssueCommentDto` |
| `deleteIssueComment(projectId, issueUid, issueCommentUid)` | DELETE | `/projects/{projectId}/issues/{issueUid}/comments/{issueCommentUid}` | `void` |
| `findProjectIssues(projectId, params)` | POST | `/projects/{projectId}/issues/list` | `SmartlingListResponse<IssueDto>` |
| `countProjectIssues(projectId, params)` | POST | `/projects/{projectId}/issues/count` | `IssuesCountDto` |
| `findAccountIssues(accountUid, params)` | POST | `/accounts/{accountUid}/issues/list` | `SmartlingListResponse<IssueDto>` |
| `countAccountIssues(accountUid, params)` | POST | `/accounts/{accountUid}/issues/count` | `IssuesCountDto` |

Two API quirks to preserve in the client:

1. **Edit comment uses POST**, not PUT, per the official swagger. The path differs from create (it includes `{issueCommentUid}`), so there is no method conflict.
2. `deleteIssueAssignee` and `deleteIssueComment` return `void`. The response envelope is `SuccessResponse` only — there is no `data`.

## File layout

```
api/issues/
├── index.ts                                # SmartlingIssuesApi
├── enums/
│   ├── issue-type.ts
│   ├── issue-sub-type.ts
│   ├── issue-severity-level.ts
│   ├── issue-state.ts
│   ├── issue-watching-state.ts
│   ├── job-filter-presence.ts
│   └── issue-sort-field.ts
├── dto/
│   ├── issue-dto.ts
│   ├── issue-string-dto.ts
│   ├── issue-text-dto.ts
│   ├── issue-state-dto.ts
│   ├── issue-answered-dto.ts
│   ├── issue-assignee-dto.ts
│   ├── issue-severity-level-dto.ts
│   ├── issue-changed-type-dto.ts
│   ├── issue-comment-dto.ts
│   ├── issues-count-dto.ts
│   ├── string-filter-dto.ts
│   ├── job-filter-dto.ts
│   ├── issue-sort-item-dto.ts
│   └── issue-sort-by-dto.ts
└── params/
    ├── create-issue-parameters.ts
    ├── edit-issue-parameters.ts
    ├── update-issue-state-parameters.ts
    ├── update-issue-answered-parameters.ts
    ├── update-issue-assignee-parameters.ts
    ├── update-issue-severity-level-parameters.ts
    ├── update-issue-type-parameters.ts
    ├── create-issue-comment-parameters.ts
    ├── edit-issue-comment-parameters.ts
    ├── base-issues-filter-parameters.ts
    ├── count-project-issues-parameters.ts
    ├── find-project-issues-parameters.ts
    ├── count-account-issues-parameters.ts
    └── find-account-issues-parameters.ts
```

The folder mirrors `api/tags/` plus an `enums/` subdirectory modeled after `api/glossaries/enums/`.

## Enums

All enums are TypeScript `enum` declarations with string values matching the wire codes. Stored in `api/issues/enums/`.

| Enum | Values |
|---|---|
| `IssueType` | `SOURCE`, `TRANSLATION` |
| `IssueSubType` | `CLARIFICATION`, `MISSPELLING`, `POOR_TRANSLATION`, `DOES_NOT_FIT_SPACE`, `PLACEHOLDER_ISSUE`, `REVIEW_TRANSLATION`, `CUSTOM`, `MT_ERROR` |
| `IssueSeverityLevel` | `LOW`, `MEDIUM`, `HIGH` |
| `IssueState` | `OPENED`, `RESOLVED` |
| `IssueWatchingState` | `WATCHING`, `NOT_WATCHING` |
| `JobFilterPresence` | `HAS_ANY`, `HAS_NOTHING` |
| `IssueSortField` | `ISSUE_TYPE_CODE = "issueTypeCode"`, `ISSUE_SUB_TYPE_CODE = "issueSubTypeCode"`, `ISSUE_STATE_CODE = "issueStateCode"`, `CREATED_DATE = "createdDate"`, `RESOLVED_DATE = "resolvedDate"`, `HASHCODE = "hashcode"`, `ISSUE_TEXT = "issueText"`, `ISSUE_TEXT_MODIFIED_DATE = "issueTextModifiedDate"`, `RESOLVED_BY_USER_UID = "resolvedByUserUid"`, `REPORTED_BY_USER_UID = "reportedByUserUid"`, `ASSIGNEE_USER_UID = "assigneeUserUid"`, `LAST_COMMENT_DATE = "lastCommentDate"` |

`IssueSortField` uses camelCase string values because the API serializes them that way. `Order` is reused from `api/parameters/order.ts` for sort direction.

## DTOs

```ts
// issue-string-dto.ts
export interface IssueStringDto {
    hashcode: string;
    localeId?: string;
}

// issue-dto.ts — createIssue, getIssueDetails, find* items
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

// issue-text-dto.ts — editIssue
export interface IssueTextDto {
    issueText: string;
    issueTextModifiedDate: string;
}

// issue-state-dto.ts — openOrCloseIssue
export interface IssueStateDto {
    issueStateCode: IssueState;
    reopened: boolean;
}

// issue-answered-dto.ts
export interface IssueAnsweredDto { answered: boolean; }

// issue-assignee-dto.ts
export interface IssueAssigneeDto { assigneeUserUid: string; }

// issue-severity-level-dto.ts
export interface IssueSeverityLevelDto { issueSeverityLevelCode: IssueSeverityLevel; }

// issue-changed-type-dto.ts
export interface IssueChangedTypeDto {
    issueTypeCode: IssueType;
    issueSubTypeCode: IssueSubType;
    localeId?: string;
}

// issue-comment-dto.ts — add / edit / get / list item
export interface IssueCommentDto {
    commentText: string;
    commentTextModifiedDate?: string;
    createdByUserUid: string;
    createdDate: string;
    issueCommentUid: string;
}

// issues-count-dto.ts
export interface IssuesCountDto { count: number; }

// string-filter-dto.ts
export interface StringFilterDto {
    hashcodes?: Array<string>;
    localeIds?: Array<string>;
}

// job-filter-dto.ts
export interface JobFilterDto {
    jobUids?: Array<string>;
    presence?: JobFilterPresence;
}

// issue-sort-item-dto.ts
export interface IssueSortItemDto {
    direction: Order;
    fieldName: IssueSortField;
}

// issue-sort-by-dto.ts
export interface IssueSortByDto {
    items: Array<IssueSortItemDto>;
}
```

`SmartlingListResponse<IssueDto>` wraps `findProjectIssues` / `findAccountIssues`. `SmartlingListResponse<IssueCommentDto>` wraps `getIssueComments`. Both share the `{ items, totalCount }` envelope already defined in `api/http/smartling-list-response.ts`.

## Parameter classes

### Per-operation params

| Class | Setters |
|---|---|
| `CreateIssueParameters` | `setIssueText(text)` *[max 4000]*, `setIssueType(IssueType)`, `setIssueSubType(IssueSubType)`, `setString({ hashcode, localeId })`, `setAssigneeUserUid(uid)`, `setIssueSeverityLevel(IssueSeverityLevel)` |
| `EditIssueParameters` | `setIssueText(text)` *[max 4000]* |
| `UpdateIssueStateParameters` | `setIssueState(IssueState)` |
| `UpdateIssueAnsweredParameters` | `setAnswered(boolean)` |
| `UpdateIssueAssigneeParameters` | `setAssigneeUserUid(uid)` *[non-empty]* |
| `UpdateIssueSeverityLevelParameters` | `setIssueSeverityLevel(IssueSeverityLevel)` |
| `UpdateIssueTypeParameters` | `setIssueType(IssueType)`, `setIssueSubType(IssueSubType)`, `setLocaleId(locale)` |
| `CreateIssueCommentParameters` | `setCommentText(text)` *[max 4000]* |
| `EditIssueCommentParameters` | `setCommentText(text)` *[max 4000]* |

### Find / count flat hierarchy

`BaseIssuesFilterParameters<T extends BaseIssuesFilterParameters<T>>` is abstract and generic, mirroring `BaseTagsStringsParameters<T>`. It defines the shared filter setters, each returning `T` (cast `this as unknown as T`):

- `setCreatedDateBefore(string)` / `setCreatedDateAfter(string)`
- `setResolvedDateBefore(string)` / `setResolvedDateAfter(string)`
- `setAnswered(boolean)` / `setReopened(boolean)` / `setHasComments(boolean)`
- `setIssueSeverityLevelCodes(IssueSeverityLevel[])`
- `setIssueStateCodes(IssueState[])`
- `setIssueSubTypeCodes(IssueSubType[])`
- `setIssueTypeCodes(IssueType[])`
- `setIssueWatchingStateCode(IssueWatchingState)`
- `setReportedByUserUid(string)`
- `setAssigneeUserUid(string)`
- `setIssueNumbers(number[])` *[max 1000]*
- `setJobFilter(JobFilterDto)` — validates `jobUids.length <= 1000` when present
- `setStringFilter(StringFilterDto)`

All four concrete classes extend the base directly (flat hierarchy). This is required to preserve fluent-chain typing — an intermediate `FindX extends CountX` chain would break the F-bounded self-type at the leaf.

| Class | Extends | Adds |
|---|---|---|
| `CountProjectIssuesParameters` | `BaseIssuesFilterParameters<CountProjectIssuesParameters>` | — |
| `FindProjectIssuesParameters` | `BaseIssuesFilterParameters<FindProjectIssuesParameters>` | `setLimit(number)` *[≥0]*, `setOffset(number)` *[≥0]*, `setSortBy(IssueSortByDto)` |
| `CountAccountIssuesParameters` | `BaseIssuesFilterParameters<CountAccountIssuesParameters>` | `setProjectIds(string[])` |
| `FindAccountIssuesParameters` | `BaseIssuesFilterParameters<FindAccountIssuesParameters>` | `setProjectIds(string[])`, `setLimit(number)`, `setOffset(number)`, `setSortBy(IssueSortByDto)` |

Trade-off: `setLimit` / `setOffset` / `setSortBy` are duplicated between the two find classes, and `setProjectIds` is duplicated between the two account classes. Each duplicated setter is a one-line passthrough to `this.set(...)`, so the total extra code is ~12 lines — preferable to introducing two intermediate generic base classes.

## Validation rules

All validation happens in setters. On violation, throw `SmartlingException` with a descriptive message — matches the tags pattern.

| Rule | Source |
|---|---|
| `issueText` length ≤ 4000 | spec description (`CreateIssueParameters`, `EditIssueParameters`) |
| `commentText` length ≤ 4000 | spec description (`CreateIssueCommentParameters`, `EditIssueCommentParameters`) |
| `issueNumbers` array length ≤ 1000 | spec `maxItems` |
| `jobFilter.jobUids` array length ≤ 1000 | spec `maxItems` |
| `limit` ≥ 0 | spec `minimum: 0` |
| `offset` ≥ 0 | spec `minimum: 0` |
| `assigneeUserUid` non-empty on `UpdateIssueAssigneeParameters.setAssigneeUserUid` | API requires the field |

No cross-field validation (e.g., `IssueType.SOURCE` ↔ `IssueSubType.POOR_TRANSLATION` consistency). The server validates and `CUSTOM` complicates rules.

## SmartlingIssuesApi class

```ts
export class SmartlingIssuesApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/issues-api/v2`;
    }

    // 18 methods following the mapping table above.
    // Each method calls this.makeRequest with the appropriate verb, URL, and serialized body.
}
```

Body conventions match the rest of the SDK:

- `POST` / `PUT` requests: pass `JSON.stringify(params.export())` as third argument to `makeRequest`.
- `GET` requests with query strings (none in this client — find/count are POSTs): pass `params.export()` directly.
- `DELETE` and `GET`-without-params: omit the third argument.

## Tests (`test/issues.spec.ts`)

Structure mirrors `test/tags.spec.ts` exactly: `beforeEach` stubs `fetch`, `ua`, and `responseMock.json`; `afterEach` restores them. Three `describe` blocks:

### `Methods` (18 `it`s, one per endpoint)

Each test:

1. Builds a representative params object (when applicable).
2. Calls the API method.
3. Asserts `sinon.assert.calledOnce(fetchStub)`.
4. Asserts `sinon.assert.calledWithExactly(fetchStub, expectedUrl, expectedRequestOptions)`.

Where the request body contains an enum value, the expected JSON string contains the literal wire value (e.g., `"issueTypeCode":"TRANSLATION"`), so an enum-to-string mismatch fails the test.

### `Parameter validation` (one `it` per rule)

Pattern from `tags.spec.ts` lines 222–432:

```ts
try {
    params.setIssueText("a".repeat(4001));
    throw new Error("Exception is not thrown.");
} catch (e) {
    assert.equal(e.constructor.name, "SmartlingException");
    assert.equal(e.message, "Issue text length must not exceed 4000 characters");
}
```

Tests cover every validated rule listed above, exercising `BaseIssuesFilterParameters` validations via `FindProjectIssuesParameters`.

### `Edge cases` (boundary `it`s)

- `setIssueText("a".repeat(4000))` succeeds.
- `setCommentText("a".repeat(4000))` succeeds.
- `setIssueNumbers(Array(1000).fill(1))` succeeds.
- `setJobFilter({ jobUids: Array(1000).fill("uid") })` succeeds.
- `setLimit(0)` and `setOffset(0)` succeed.

## Root exports (`index.ts`)

~30 new `export * from "./api/issues/..."` lines covering the index, all enums, all DTOs, and all parameter classes, alongside the existing tags/vendors blocks.

## Error handling

None added at the SDK layer. HTTP errors propagate from `SmartlingBaseApi.makeRequest`; setter-validation errors throw `SmartlingException` at call time. Matches the tags pattern.

## Builder integration

`SmartlingApiClientBuilder.build(SmartlingIssuesApi)` works without changes — the builder is generic over `SmartlingBaseApi` subclasses.
