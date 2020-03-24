import sinon from "sinon";
import fs from "fs";
import assert from "assert";
import SmartlingAuditLogApi from "../api/audit-log";
import CreateAuditLogParameters from "../api/audit-log/params/create-audit-log-parameters";
import SearchAuditLogParameters from "../api/audit-log/params/search-audit-log-parameters";
import OrderEnum from "../api/audit-log/params/order-enum";

const { loggerMock, authMock, responseMock } = require("./mock");

describe("SmartlingAuditLogApi class tests.", () => {
    let auditLogApi;
    let auditLogApiFetchStub;
    let auditLogApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        auditLogApi = new SmartlingAuditLogApi(authMock, loggerMock, "https://test.com");
        auditLogApi.authApi = authMock;

        auditLogApiFetchStub = sinon.stub(auditLogApi, "fetch");
        auditLogApiUaStub = sinon.stub(auditLogApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        auditLogApiUaStub.returns("test_user_agent");
        auditLogApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        auditLogApiFetchStub.restore();
        responseMockJsonStub.restore();
        auditLogApiUaStub.restore();
    });

    describe("Params", () => {
        it("Create log record parameters", () => {
            const createParams: CreateAuditLogParameters = new CreateAuditLogParameters(
                new Date("2020-10-10T00:00:00Z"),
                "TEST"
            );

            createParams
                .setBatchUid("test_batch_uid")
                .setClientData({
                    foo: "bar"
                })
                .setClientUserEmail("user_email")
                .setClientUserId("user_id")
                .setClientUserName("user_name")
                .setDescription("description")
                .setEnvId("env_id")
                .setFileUid("file_uid")
                .setFileUri("file_uri")
                .setSourceLocaleId("source_locale")
                .setTargetLocaleId("target_locale")
                .setTargetLocaleIds(["target_locales"])
                .setTranslationJobAuthorize(true)
                .setTranslationJobDueDate(new Date("2020-10-10T00:00:00Z"))
                .setTranslationJobName("job_name")
                .setTranslationJobUid("job_uid");

            assert.deepEqual(
                {
                    actionTime: "2020-10-10T00:00:00Z",
                    actionType: "TEST",
                    batchUid: "test_batch_uid",
                    clientData: { foo: "bar" },
                    clientUserEmail: "user_email",
                    clientUserId: "user_id",
                    clientUserName: "user_name",
                    description: "description",
                    envId: "env_id",
                    fileUid: "file_uid",
                    fileUri: "file_uri",
                    sourceLocaleId: "source_locale",
                    targetLocaleId: "target_locale",
                    targetLocaleIds: ["target_locales"],
                    translationJobAuthorize: true,
                    translationJobDueDate: "2020-10-10T00:00:00Z",
                    translationJobName: "job_name",
                    translationJobUid: "job_uid"
                },
                createParams.export()
            );
        });

        describe("Search parameters", () => {
            it("Defaults", () => {
                const searchParams: SearchAuditLogParameters = new SearchAuditLogParameters();

                assert.deepEqual(
                    {
                        "endTime": "now() - 30d",
                        "limit": 10,
                        "offset": 0,
                        "sort": "time:desc",
                        "startTime": "now()"

                    },
                    searchParams.export()
                );
            });

            it("Search parameters", () => {
                const searchParams: SearchAuditLogParameters = new SearchAuditLogParameters();

                searchParams
                    .setOffset(10)
                    .setLimit(23)
                    .setSort("time", OrderEnum.ORDER_ASC)
                    .setStartTime("now() - 5h")
                    .setEndTime("now() - 10h")
                    .setQuery("test");

                assert.deepEqual(
                    {
                        "endTime": "now() - 10h",
                        "limit": 23,
                        "offset": 10,
                        "sort": "time:asc",
                        "startTime": "now() - 5h",
                        "q": "test"

                    },
                    searchParams.export()
                );
            });
        });
    });

    describe("Methods", () => {
        it("Create project level log record", async () => {
            const createParams: CreateAuditLogParameters = new CreateAuditLogParameters(
                new Date("2020-10-10T00:00:00Z"),
                "TEST"
            );

            await auditLogApi.createProjectLevelLogRecord("test_project", createParams);

            sinon.assert.calledOnce(auditLogApiFetchStub);
            sinon.assert.calledWithExactly(
                auditLogApiFetchStub,
                "https://test.com/audit-log-api/v2/projects/test_project/logs", {
                    body: "{\"actionTime\":\"2020-10-10T00:00:00Z\",\"actionType\":\"TEST\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Create account level log record", async () => {
            const createParams: CreateAuditLogParameters = new CreateAuditLogParameters(
                new Date("2020-10-10T00:00:00Z"),
                "TEST"
            );

            await auditLogApi.createAccountLevelLogRecord("test_account", createParams);

            sinon.assert.calledOnce(auditLogApiFetchStub);
            sinon.assert.calledWithExactly(
                auditLogApiFetchStub,
                "https://test.com/audit-log-api/v2/accounts/test_account/logs", {
                    body: "{\"actionTime\":\"2020-10-10T00:00:00Z\",\"actionType\":\"TEST\"}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Search project level log records", async () => {
            const searchParams: SearchAuditLogParameters = new SearchAuditLogParameters();

            searchParams
                .setOffset(10)
                .setLimit(100500)
                .setQuery("test project level query");

            await auditLogApi.searchProjectLevelLogRecord("test_project", searchParams);

            sinon.assert.calledOnce(auditLogApiFetchStub);
            sinon.assert.calledWithExactly(
                auditLogApiFetchStub,
                "https://test.com/audit-log-api/v2/projects/test_project/logs?offset=10&limit=100500&startTime=now()&endTime=now()%20-%2030d&sort=time%3Adesc&q=test%20project%20level%20query", {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });

        it("Search account level log records", async () => {
            const searchParams: SearchAuditLogParameters = new SearchAuditLogParameters();

            searchParams
                .setOffset(5)
                .setLimit(12)
                .setQuery("test account level query");

            await auditLogApi.searchAccountLevelLogRecord("test_account", searchParams);

            sinon.assert.calledOnce(auditLogApiFetchStub);
            sinon.assert.calledWithExactly(
                auditLogApiFetchStub,
                "https://test.com/audit-log-api/v2/accounts/test_account/logs?offset=5&limit=12&startTime=now()&endTime=now()%20-%2030d&sort=time%3Adesc&q=test%20account%20level%20query", {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });
    });
});
