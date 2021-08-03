import sinon from "sinon";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../api/builder";
import { SmartlingFilesApi } from "../api/files";
import { SmartlingJobsApi } from "../api/jobs";
import { SmartlingJobBatchesApi } from "../api/job-batches";
import { SmartlingProjectsApi } from "../api/projects";
import { SmartlingStringsApi } from "../api/strings";
import { SmartlingContextApi } from "../api/context";
import { SmartlingBaseApi } from "../api/base";
import { SmartlingAuthApi } from "../api/auth";

const packageJson = require("../../package.json");

function assertApiClient(Type: any, apiClient: SmartlingBaseApi, assertAuthClient: boolean = true) {
    assert.equal(apiClient instanceof SmartlingBaseApi, true);
    assert.equal(apiClient instanceof Type, true);

    assert.deepEqual(
        apiClient["options"], {
            timeout: 100500,
            headers: {
                "X-SL-ServiceOrigin": "example-lib-name"
            }
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
        apiClient["clientLibId"],
        "example-lib-name"
    );

    assert.equal(
        apiClient["clientLibVersion"],
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
            apiClient["authApi"]["clientLibId"],
            "example-lib-name"
        );

        assert.equal(
            apiClient["authApi"]["clientLibVersion"],
            "example-lib-version"
        );
    }
}

describe("SmartlingApiClientBuilder class tests.", () => {
    let apiClientBuilder: SmartlingApiClientBuilder;

    beforeEach(() => {
        apiClientBuilder = new SmartlingApiClientBuilder()
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
            apiClient["clientLibId"],
            packageJson.name
        );

        assert.equal(
            apiClient["clientLibVersion"],
            packageJson.version
        );

        assert.equal(
            apiClient["authApi"]["clientLibId"],
            packageJson.name
        );

        assert.equal(
            apiClient["authApi"]["clientLibVersion"],
            packageJson.version
        );
    });

    it("Smartling api builder can use existing auth api client", () => {
        const authApiClient = new SmartlingAuthApi(
            "foo",
            "bar",
            {
                debug: () => {},
                warn: () => {},
                error: () => {},
                test: () => {}
            },
            "baz"
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
            apiClient["clientLibId"],
            "example-lib-name"
        );

        assert.equal(
            apiClient["clientLibVersion"],
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
            apiClient["authApi"]["clientLibId"],
            packageJson.name
        );

        assert.equal(
            apiClient["authApi"]["clientLibVersion"],
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

    it("Instantiates files api client", () => {
        assertApiClient(
            SmartlingFilesApi,
            apiClientBuilder.build(SmartlingFilesApi)
        );
    });

    it("Instantiates jobs api client", () => {
        assertApiClient(
            SmartlingJobsApi,
            apiClientBuilder.build(SmartlingJobsApi)
        );
    });

    it("Instantiates job batches api client", () => {
        assertApiClient(
            SmartlingJobBatchesApi,
            apiClientBuilder.build(SmartlingJobBatchesApi)
        );
    });

    it("Instantiates projects api client", () => {
        assertApiClient(
            SmartlingProjectsApi,
            apiClientBuilder.build(SmartlingProjectsApi)
        );
    });

    it("Instantiates strings api client", () => {
        assertApiClient(
            SmartlingStringsApi,
            apiClientBuilder.build(SmartlingStringsApi)
        );
    });

    it("Instantiates context api client", () => {
        assertApiClient(
            SmartlingContextApi,
            apiClientBuilder.build(SmartlingContextApi)
        );
    });
});
