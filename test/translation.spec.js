const sinon = require("sinon");
const SmartlingTranslationApi = require("../api/translation");

describe("SmartlingTranslationApi class tests.", () => {
    it("Create translation package.", async () => {
        const translationApi = new SmartlingTranslationApi({}, {}, "https://test");

        const makeRequestStub = sinon.stub(translationApi, "makeRequest");

        translationApi.createTranslationPackage("projectId", "jobUid", "localeId", "workflowStepUid");

        sinon.assert.calledOnce(makeRequestStub);
        sinon.assert.calledWithExactly(
            makeRequestStub,
            "post",
            "https://test/translations-api/v2//projects/projectId/locales/localeId/translation-packages",
            JSON.stringify({
                workflowStepUid: "workflowStepUid",
                translationJobUid: "jobUid"
            })
        );
    });
});
