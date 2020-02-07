const sinon = require("sinon");
const fs = require("fs");
const assert = require("assert");
const SmartlingTranslationApi = require("../api/translation");

const { loggerMock, authMock, responseMock } = require("./mock");

describe("SmartlingTranslationApi class tests.", () => {
    let translationApi;
    let translationApiFetchStub;
    let translationApiGetDefaultHeaderSpy;
    let translationApiUaStub;
    let translationApiAlterRequestDataSpy;
    let authResetTokenStub;
    let responseMockTextStub;
    let responseMockJsonStub;

    beforeEach(() => {
        translationApi = new SmartlingTranslationApi(authMock, loggerMock, "https://test.com");
        translationApi.authApi = authMock;

        translationApiFetchStub = sinon.stub(translationApi, "fetch");
        translationApiGetDefaultHeaderSpy = sinon.spy(translationApi, "getDefaultHeaders");
        translationApiUaStub = sinon.stub(translationApi, "ua");
        translationApiAlterRequestDataSpy = sinon.spy(translationApi, "alterRequestData");
        authResetTokenStub = sinon.stub(translationApi.authApi, "resetToken");
        responseMockTextStub = sinon.stub(responseMock, "text");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        translationApiUaStub.returns("test_user_agent");
        translationApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        translationApiFetchStub.restore();
        translationApiGetDefaultHeaderSpy.restore();
        authResetTokenStub.restore();
        responseMockTextStub.restore();
        responseMockJsonStub.restore();
        translationApiUaStub.restore();
    });

    it("Create translation package.", async () => {
        const payload = {
            method: "post",
            headers: {
                Authorization: "test_token_type test_access_token",
                "Content-Type": "application/json",
                "User-Agent": "test_user_agent"
            },
            body: JSON.stringify({
                workflowStepUid: "workflowStepUid",
                translationJobUid: "jobUid"
            })
        };

        await translationApi.createTranslationPackage("projectId", "jobUid", "localeId", "workflowStepUid");

        sinon.assert.calledOnce(translationApiGetDefaultHeaderSpy);

        sinon.assert.calledOnce(translationApiAlterRequestDataSpy);
        sinon.assert.calledWithExactly(
            translationApiAlterRequestDataSpy,
            "https://test.com/translations-api/v2//projects/projectId/locales/localeId/translation-packages",
            payload
        );

        sinon.assert.calledOnce(translationApiFetchStub);
        sinon.assert.calledWithExactly(
            translationApiFetchStub,
            "https://test.com/translations-api/v2//projects/projectId/locales/localeId/translation-packages",
            payload
        );

        sinon.assert.notCalled(authResetTokenStub);
        sinon.assert.notCalled(responseMockTextStub);
        sinon.assert.calledOnce(responseMockJsonStub);
    });

    it("Wrong header after sequence of calls.", async () => {
        const fileName = "test.xliff";
        const filePath = "./";

        fs.writeFileSync(`${filePath}${fileName}`, "test");

        await translationApi.importTranslations("projectId", "localeId", filePath, fileName);
        await translationApi.createTranslationPackage("projectId", "jobUid", "localeId", "workflowStepUid");

        sinon.assert.calledTwice(translationApiGetDefaultHeaderSpy);
        sinon.assert.calledTwice(translationApiAlterRequestDataSpy);
        sinon.assert.calledTwice(translationApiFetchStub);

        // Call importTranslations.
        sinon.assert.calledWith(
            translationApiFetchStub.getCall(0),
            "https://test.com/translations-api/v2//projects/projectId/locales/localeId/content"
        );
        assert.equal(
            translationApiFetchStub.getCall(0).args[1].method,
            "post"
        );
        assert.equal(
            translationApiFetchStub.getCall(0).args[1].headers.Authorization,
            "test_token_type test_access_token"
        );
        assert.equal(
            translationApiFetchStub.getCall(0).args[1].headers["User-Agent"],
            "test_user_agent"
        );
        assert.equal(
            translationApiFetchStub.getCall(0).args[1].headers["Content-Type"].indexOf("multipart/form-data;") !== -1,
            true
        );
        // Call createTranslationPackage.
        sinon.assert.calledWithExactly(
            translationApiFetchStub.getCall(1),
            "https://test.com/translations-api/v2//projects/projectId/locales/localeId/translation-packages",
            {
                method: "post",
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                },
                body: JSON.stringify({
                    workflowStepUid: "workflowStepUid",
                    translationJobUid: "jobUid"
                })
            }
        );

        sinon.assert.notCalled(authResetTokenStub);
        sinon.assert.notCalled(responseMockTextStub);
        sinon.assert.calledTwice(responseMockJsonStub);
    });
});
