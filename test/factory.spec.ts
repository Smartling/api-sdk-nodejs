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

function assertApiClient(Type: any, apiClient: SmartlingBaseApi) {
    assert.equal(apiClient instanceof SmartlingBaseApi, true);
    assert.equal(apiClient instanceof Type, true);

    assert.equal(
        apiClient.clientLibId,
        "test_client_lib_id"
    );

    assert.equal(
        apiClient.clientLibVersion,
        "test_client_lib_version"
    );

    assert.deepEqual(
        apiClient.options, {
            timeout: 100500,
            headers: {
                "X-SL-ServiceOrigin": "test_client_lib_id"
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

    assert.equal(
        apiClient["authApi"].clientLibId,
        "test_client_lib_id"
    );

    assert.equal(
        apiClient["authApi"].clientLibVersion,
        "test_client_lib_version"
    );
}

describe("SmartlingApiFactory class tests.", () => {
    let apiFactory: SmartlingApiFactory;

    beforeEach(() => {
        apiFactory = new SmartlingApiFactory({
            userId: "test_user_id",
            userSecret: "test_user_secret"
        }, {
            clientLibId: "test_client_lib_id",
            clientLibVersion: "test_client_lib_version"
        }, "test_base_url", {
            debug: () => {},
            info: () => {},
            warn: () => {},
            error: () => {}
        });
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
});
