import sinon from "sinon";
import assert from "assert";
import { SmartlingAuditLogApi } from "../api/audit-log";
import { SmartlingApiFactory } from "../api/factory";
import SmartlingBaseApi from "../api/base";
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

const packageJson = require("../../package.json");

function assertApiClient(Type: any, apiClient: SmartlingBaseApi) {
    assert.equal(apiClient instanceof SmartlingBaseApi, true);
    assert.equal(apiClient instanceof Type, true);

    assert.deepEqual(
        apiClient.options, {
            timeout: 100500,
            headers: {
                "X-SL-ServiceOrigin": packageJson.name
            }
        }
    );

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
}

describe("SmartlingApiFactory class tests.", () => {
    let apiFactory: SmartlingApiFactory;

    beforeEach(() => {
        apiFactory = new SmartlingApiFactory(
            "test_user_id",
            "test_user_secret",
            "test_base_url", {
                debug: () => {},
                warn: () => {},
                error: () => {}
            }
        );
    });

    it("Smartling api factory returns api client with default lib id and version", () => {
        const factory = new SmartlingApiFactory(
            "test_user_id",
            "test_user_secret",
            "test_base_url"
        );

        const apiClient = factory.createApiClient(SmartlingAuditLogApi);

        assert.equal(
            apiClient.clientLibId,
            packageJson.name
        );

        assert.equal(
            apiClient.clientLibVersion,
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

    it("Default lib id and version can be modified after api client creation", () => {
        const factory = new SmartlingApiFactory(
            "test_user_id",
            "test_user_secret",
            "test_base_url"
        );

        const apiClient = factory.createApiClient(SmartlingAuditLogApi);

        apiClient.clientLibId = "test_client_lib_id";
        apiClient.clientLibVersion = "test_client_lib_version";

        assert.equal(
            apiClient.clientLibId,
            "test_client_lib_id"
        );

        assert.equal(
            apiClient.clientLibVersion,
            "test_client_lib_version"
        );
    });

    it("Smartling api factory provides default null logger", () => {
        const factory = new SmartlingApiFactory(
            "test_user_id",
            "test_user_secret",
            "test_base_url"
        );

        const clientApi = factory.createApiClient(SmartlingAuditLogApi);

        assert.equal(
            typeof clientApi["logger"].debug === "function",
            true
        );

        assert.equal(
            typeof clientApi["logger"].warn === "function",
            true
        );

        assert.equal(
            typeof clientApi["logger"].error === "function",
            true
        );
    });

    it("Instantiates audit log api client", () => {
        assertApiClient(
            SmartlingAuditLogApi,
            apiFactory.createApiClient(SmartlingAuditLogApi, { timeout: 100500 })
        );
    });

    it("Instantiates file api client", () => {
        assertApiClient(
            SmartlingFileApi,
            apiFactory.createApiClient(SmartlingFileApi, { timeout: 100500 })
        );
    });

    it("Instantiates jobs api client", () => {
        assertApiClient(
            SmartlingJobApi,
            apiFactory.createApiClient(SmartlingJobApi, { timeout: 100500 })
        );
    });

    it("Instantiates jobs facade api client", () => {
        assertApiClient(
            SmartlingJobFacadeApi,
            apiFactory.createApiClient(SmartlingJobFacadeApi, { timeout: 100500 })
        );
    });

    it("Instantiates progress tracker api client", () => {
        assertApiClient(
            SmartlingProgressTrackerApi,
            apiFactory.createApiClient(SmartlingProgressTrackerApi, { timeout: 100500 })
        );
    });

    it("Instantiates project api client", () => {
        assertApiClient(
            SmartlingProjectApi,
            apiFactory.createApiClient(SmartlingProjectApi, { timeout: 100500 })
        );
    });

    it("Instantiates strings api client", () => {
        assertApiClient(
            SmartlingStringsApi,
            apiFactory.createApiClient(SmartlingStringsApi, { timeout: 100500 })
        );
    });

    it("Instantiates translation api client", () => {
        assertApiClient(
            SmartlingTranslationApi,
            apiFactory.createApiClient(SmartlingTranslationApi, { timeout: 100500 })
        );
    });

    it("Instantiates translation requests api client", () => {
        assertApiClient(
            SmartlingTranslationRequestsApi,
            apiFactory.createApiClient(SmartlingTranslationRequestsApi, { timeout: 100500 })
        );
    });

    it("Instantiates settings service api client", () => {
        assertApiClient(
            SmartlingSettingsServiceApi,
            apiFactory.createApiClient(SmartlingSettingsServiceApi, { timeout: 100500 })
        );
    });

    it("Instantiates log service api client", () => {
        assertApiClient(
            SmartlingLogApi,
            apiFactory.createApiClient(SmartlingLogApi, { timeout: 100500 })
        );
    });

    it("Instantiates bulk request service api client", () => {
        assertApiClient(
            BulkRequestServiceApi,
            apiFactory.createApiClient(BulkRequestServiceApi, { timeout: 100500 })
        );
    });
});
