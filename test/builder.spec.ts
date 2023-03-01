/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */

import assert from "assert";
import { SmartlingApiClientBuilder } from "../api/builder/index";
import { SmartlingFilesApi } from "../api/files/index";
import { SmartlingJobsApi } from "../api/jobs/index";
import { SmartlingJobBatchesApi } from "../api/job-batches/index";
import { SmartlingProjectsApi } from "../api/projects/index";
import { SmartlingStringsApi } from "../api/strings/index";
import { SmartlingContextApi } from "../api/context/index";
import { SmartlingBaseApi } from "../api/base/index";
import { SmartlingAuthApi } from "../api/auth/index";

const packageJson = require("../../package.json");

function assertApiClient(Type: any, apiClient: SmartlingBaseApi, assertAuthClient = true) {
    assert.equal(apiClient instanceof SmartlingBaseApi, true);
    assert.equal(apiClient instanceof Type, true);

    assert.deepEqual(
        apiClient["options"], {
            timeout: 100500
        }
    );

    assert.equal(
        typeof apiClient["logger"].debug === "function",
        true
    );

    assert.equal(
        typeof apiClient["logger"].warn === "function",
        true
    );

    assert.equal(
        typeof apiClient["logger"].error === "function",
        true
    );

    assert.equal(
        typeof apiClient["logger"].test === "function",
        true
    );

    assert.equal(
        apiClient.getClientLibId(),
        "example-lib-name"
    );

    assert.equal(
        apiClient.getClientLibVersion(),
        "example-lib-version"
    );

    if (assertAuthClient === true) {
        assert.equal(
            apiClient["authApi"]["userIdentifier"],
            "test_user_id"
        );

        assert.equal(
            apiClient["authApi"]["tokenSecret"],
            "test_user_secret"
        );

        assert.equal(
            apiClient["authApi"]["entrypoint"],
            "test_base_url/auth-api/v2"
        );

        assert.equal(
            apiClient["authApi"].getClientLibId(),
            "example-lib-name"
        );

        assert.equal(
            apiClient["authApi"].getClientLibVersion(),
            "example-lib-version"
        );
    }
}

describe("SmartlingApiClientBuilder class tests.", () => {
    let apiClientsBuilder: SmartlingApiClientBuilder;

    beforeEach(() => {
        apiClientsBuilder = new SmartlingApiClientBuilder()
            .setLogger({
                debug: () => {},
                warn: () => {},
                error: () => {},
                test: () => {}
            })
            .setClientLibMetadata("example-lib-name", "example-lib-version")
            .setHttpClientConfiguration({
                timeout: 100500
            })
            .authWithUserIdAndUserSecret("test_user_id", "test_user_secret")
            .setBaseSmartlingApiUrl("test_base_url");
    });

    it("Smartling api builder returns api client with default lib id and version", () => {
        const apiClientBuilder = new SmartlingApiClientBuilder()
            .authWithUserIdAndUserSecret("test_user_id", "test_user_secret")
            .setBaseSmartlingApiUrl("test_base_url")
            .setLogger({
                debug: () => {},
                warn: () => {},
                error: () => {}
            });

        const apiClient = apiClientBuilder.build(SmartlingJobsApi);

        assert.equal(
            apiClient.getClientLibId(),
            packageJson.name
        );

        assert.equal(
            apiClient.getClientLibVersion(),
            packageJson.version
        );

        assert.equal(
            apiClient["authApi"].getClientLibId(),
            packageJson.name
        );

        assert.equal(
            apiClient["authApi"].getClientLibVersion(),
            packageJson.version
        );
    });

    it("Smartling api builder can use existing auth api client", () => {
        const authApiClient = new SmartlingAuthApi(
            "baz",
            "foo",
            "bar",
            {
                debug: () => {},
                warn: () => {},
                error: () => {},
                test: () => {}
            }
        );

        const apiClientBuilder = new SmartlingApiClientBuilder()
            .setLogger({
                debug: () => {},
                warn: () => {},
                error: () => {},
                test: () => {}
            })
            .setClientLibMetadata("example-lib-name", "example-lib-version")
            .setHttpClientConfiguration({
                timeout: 100500,
                headers: {
                    "test-additional-header": "bar"
                }
            })
            .authWithAuthApiClient(authApiClient)
            .setBaseSmartlingApiUrl("test_base_url");

        const apiClient = apiClientBuilder.build(SmartlingJobsApi);

        assert.equal(
            apiClient.getClientLibId(),
            "example-lib-name"
        );

        assert.equal(
            apiClient.getClientLibVersion(),
            "example-lib-version"
        );

        assert.equal(
            apiClient["authApi"]["userIdentifier"],
            "foo"
        );

        assert.equal(
            apiClient["authApi"]["tokenSecret"],
            "bar"
        );

        assert.equal(
            apiClient["authApi"]["entrypoint"],
            "baz/auth-api/v2"
        );

        assert.equal(
            apiClient["authApi"].getClientLibId(),
            packageJson.name
        );

        assert.equal(
            apiClient["authApi"].getClientLibVersion(),
            packageJson.version
        );
    });

    it("Smartling api builder provides default null logger", () => {
        const apiClientBuilder = new SmartlingApiClientBuilder()
            .authWithUserIdAndUserSecret("test_user_id", "test_user_secret")
            .setBaseSmartlingApiUrl("test_base_url");

        const apiClient = apiClientBuilder.build(SmartlingJobsApi);

        assert.equal(
            typeof apiClient["logger"].debug === "function",
            true
        );

        assert.equal(
            typeof apiClient["logger"].warn === "function",
            true
        );

        assert.equal(
            typeof apiClient["logger"].error === "function",
            true
        );
    });

    it("should provide http client options to auth client", () => {
        const httpClientOptions = { test: "value" };
        const apiClient = new SmartlingApiClientBuilder()
            .authWithUserIdAndUserSecret("test_user_id", "test_user_secret")
            .setBaseSmartlingApiUrl("test_base_url")
            .setHttpClientConfiguration(httpClientOptions)
            .build(SmartlingJobsApi);

        assert.equal(apiClient["options"], httpClientOptions);
    });

    it("Instantiates files api client", () => {
        assertApiClient(
            SmartlingFilesApi,
            apiClientsBuilder.build(SmartlingFilesApi)
        );
    });

    it("Instantiates jobs api client", () => {
        assertApiClient(
            SmartlingJobsApi,
            apiClientsBuilder.build(SmartlingJobsApi)
        );
    });

    it("Instantiates job batches api client", () => {
        assertApiClient(
            SmartlingJobBatchesApi,
            apiClientsBuilder.build(SmartlingJobBatchesApi)
        );
    });

    it("Instantiates projects api client", () => {
        assertApiClient(
            SmartlingProjectsApi,
            apiClientsBuilder.build(SmartlingProjectsApi)
        );
    });

    it("Instantiates strings api client", () => {
        assertApiClient(
            SmartlingStringsApi,
            apiClientsBuilder.build(SmartlingStringsApi)
        );
    });

    it("Instantiates context api client", () => {
        assertApiClient(
            SmartlingContextApi,
            apiClientsBuilder.build(SmartlingContextApi)
        );
    });
});
