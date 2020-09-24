import sinon from "sinon";
import assert from "assert";
import { SmartlingApiClientBuilder } from "../api/builder";
import { SmartlingAuditLogApi } from "../api/audit-log";
import SmartlingBaseApi from "../api/base";
import SmartlingAuthApi from "../api/auth";
import SmartlingFileApi from "../api/file";
import SmartlingJobApi from "../api/job";
import SmartlingJobFacadeApi from "../api/job-facade";
import SmartlingProgressTrackerApi from "../api/progress-tracker";
import SmartlingProjectApi from "../api/project";
import SmartlingStringsApi from "../api/strings";
import SmartlingTranslationApi from "../api/translation";
import SmartlingTranslationRequestsApi from "../api/translation-requests";
import { SmartlingSettingsServiceApi } from "../api/settings-service";
import { SmartlingLogApi } from "../api/log";
import { BulkRequestServiceApi } from "../api/bulk-request";
import { PublishedFilesApi } from "../api/published-files/index";

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
            apiClient["authApi"].userIdentifier,
            "test_user_id"
        );

        assert.equal(
            apiClient["authApi"].tokenSecret,
            "test_user_secret"
        );

        assert.equal(
            apiClient["authApi"].entrypoint,
            "test_base_url/auth-api/v2"
        );

        assert.equal(
            apiClient["authApi"].clientLibId,
            "example-lib-name"
        );

        assert.equal(
            apiClient["authApi"].clientLibVersion,
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

        const apiClient = apiClientBuilder.build(SmartlingAuditLogApi);

        assert.equal(
            apiClient["clientLibId"],
            packageJson.name
        );

        assert.equal(
            apiClient["clientLibVersion"],
            packageJson.version
        );

        assert.equal(
            apiClient["authApi"].clientLibId,
            packageJson.name
        );

        assert.equal(
            apiClient["authApi"].clientLibVersion,
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

        const apiClient = apiClientBuilder.build(SmartlingAuditLogApi);

        assert.equal(
            apiClient["clientLibId"],
            "example-lib-name"
        );

        assert.equal(
            apiClient["clientLibVersion"],
            "example-lib-version"
        );

        assert.equal(
            apiClient["authApi"].userIdentifier,
            "foo"
        );

        assert.equal(
            apiClient["authApi"].tokenSecret,
            "bar"
        );

        assert.equal(
            apiClient["authApi"].entrypoint,
            "baz/auth-api/v2"
        );

        assert.equal(
            apiClient["authApi"].clientLibId,
            packageJson.name
        );

        assert.equal(
            apiClient["authApi"].clientLibVersion,
            packageJson.version
        );
    });

    it("Smartling api builder provides default null logger", () => {
        const apiClientBuilder = new SmartlingApiClientBuilder()
            .authWithUserIdAndUserSecret("test_user_id", "test_user_secret")
            .setBaseSmartlingApiUrl("test_base_url");

        const apiClient = apiClientBuilder.build(SmartlingAuditLogApi);

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

    it("Instantiates audit log api client", () => {
        assertApiClient(
            SmartlingAuditLogApi,
            apiClientBuilder.build(SmartlingAuditLogApi)
        );
    });

    it("Instantiates file api client", () => {
        assertApiClient(
            SmartlingFileApi,
            apiClientBuilder.build(SmartlingFileApi)
        );
    });

    it("Instantiates jobs api client", () => {
        assertApiClient(
            SmartlingJobApi,
            apiClientBuilder.build(SmartlingJobApi)
        );
    });

    it("Instantiates jobs facade api client", () => {
        assertApiClient(
            SmartlingJobFacadeApi,
            apiClientBuilder.build(SmartlingJobFacadeApi)
        );
    });

    it("Instantiates progress tracker api client", () => {
        assertApiClient(
            SmartlingProgressTrackerApi,
            apiClientBuilder.build(SmartlingProgressTrackerApi)
        );
    });

    it("Instantiates project api client", () => {
        assertApiClient(
            SmartlingProjectApi,
            apiClientBuilder.build(SmartlingProjectApi)
        );
    });

    it("Instantiates strings api client", () => {
        assertApiClient(
            SmartlingStringsApi,
            apiClientBuilder.build(SmartlingStringsApi)
        );
    });

    it("Instantiates translation api client", () => {
        assertApiClient(
            SmartlingTranslationApi,
            apiClientBuilder.build(SmartlingTranslationApi)
        );
    });

    it("Instantiates translation requests api client", () => {
        assertApiClient(
            SmartlingTranslationRequestsApi,
            apiClientBuilder.build(SmartlingTranslationRequestsApi)
        );
    });

    it("Instantiates settings service api client", () => {
        assertApiClient(
            SmartlingSettingsServiceApi,
            apiClientBuilder.build(SmartlingSettingsServiceApi)
        );
    });

    it("Instantiates log service api client", () => {
        assertApiClient(
            SmartlingLogApi,
            apiClientBuilder.build(SmartlingLogApi),
            false
        );
    });

    it("Instantiates bulk request service api client", () => {
        assertApiClient(
            BulkRequestServiceApi,
            apiClientBuilder.build(BulkRequestServiceApi)
        );
    });

    it("Instantiates published files api client", () => {
        assertApiClient(
            PublishedFilesApi,
            apiClientBuilder.build(PublishedFilesApi)
        );
    });
});
