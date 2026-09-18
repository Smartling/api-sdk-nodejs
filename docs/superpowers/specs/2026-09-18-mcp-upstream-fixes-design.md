# MCP upstream fixes design

## Context

The Smartling MCP service consumes this SDK and hit 8 gaps/bugs while using
the Files, Job Batches, and download-parameter APIs. All fields/behaviors
below were verified against Smartling's published OpenAPI spec
(`https://api-reference.smartling.com/swagger.json`, with external `$ref`s
resolved against `github.com/Smartling/api-docs`), not guessed.

## Changes

### 1. Export `FileStatusForProjectDto` from the package root
`api/files/dto/file-status-for-project-dto.ts` exists and is used by
`getRecentlyUploadedFiles`, but isn't re-exported from the root `index.ts`
like its sibling DTOs are. Add the missing `export *` line.

### 2. Typed setters on `RecentlyUploadedFilesParameters`
Confirmed query params on `GET /files-api/v2/projects/{projectId}/files/list`:
- `setFileTypes(fileTypes: FileType[])` → sets `fileTypes[]`
- `setLastUploadedAfter(date: Date)` / `setLastUploadedBefore(date: Date)` →
  ISO string in the same `YYYY-MM-DDThh:mm:ssZ` format
  `RecentlyPublishedFilesParameters.setPublishedAfterDate` already produces
- `setOrderBy(orderBy: FilesOrderBy)` — new enum in
  `api/files/params/files-order-by.ts` with the exact spec values:
  `created`, `fileUri`, `lastUploaded`, `created_asc`, `created_desc`,
  `fileUri_asc`, `fileUri_desc`, `lastUploaded_asc`, `lastUploaded_desc`

### 3. `setZipFileName()` on `DownloadFileAllTranslationsParameters`
Confirmed `zipFileName` (query, optional string) exists on
`GET .../locales/all/file/zip`. Add the setter, same pattern as the existing
one on `DownloadMultipleFilesTranslationsParameters`.

### 4. Fix `downloadFileAllTranslations` return type
Endpoint response is binary. The method already calls `makeRequest` with
`ResponseBodyType.ARRAY_BUFFER`; only the declared return type
(`Promise<string>`) was wrong. Change to `Promise<ArrayBuffer>`.

### 5. `hasError: boolean` on `BatchListItemDto`
Confirmed on the `Batch` schema (job-batches API) alongside the fields
`BatchListItemDto` already declares.

### 6. Fields on `FileStatusForAllLocalesDto`
Confirmed present in the `GET .../file/status` response example (though
absent from the schema's own `properties`/`required` list — trusting the
example/real traffic over the incomplete schema):
- `directives?: Record<string, string>`
- `namespace?: { name: string }`
- `totalPageCount?: number`
- `pageCountStatus?: PageCountStatus` — new enum in
  `api/files/params/page-count-status.ts`: `NOT_AVAILABLE_UNSUPPORTED`,
  `PROCESSING`, `AVAILABLE`, `NOT_AVAILABLE_LEGACY`,
  `NOT_AVAILABLE_PROCESSING_FAILED`

### 7. `RetrievalType.CONTEXT_MATCHING_INSTRUMENTED`
Add the missing enum value (`"contextMatchingInstrumented"`). No new setter
method — the existing `setRetrievalType()` on `DownloadFileBaseParameters` is
already the typed setter; it just couldn't express this value before.

### 8. `SmartlingFilesApi.renameFile()`
Wraps `POST /files-api/v2/projects/{projectId}/file/rename`. Multipart
form-data body with required `fileUri` and `newFileUri`. Signature:
`renameFile(projectId: string, fileUri: string, newFileUri: string): Promise<boolean>`,
same `FormData`/`fixContentTypeHeaderCase` pattern as the existing
`deleteFile`.

## Testing

Each change gets a unit test in the matching `test/*.spec.ts` file, following
existing patterns (sinon stubs on `fetch`, asserting method/URL/body).

## Out of scope
No changes to build tooling, other endpoints, or existing method signatures
beyond the return-type fix in item 4.
