import sinon from "sinon";
import assert from "assert";
import { SmartlingMachineTranslationsApi } from "../api/mt";
import { SmartlingMTParameters } from "../api/mt/params/smartling-mt-parameters";
import { SmartlingAuthApi } from "../api/auth/index";
import { SmartlingException } from "../api/exception/index";
import { loggerMock, authMock, responseMock } from "./mock";

describe("SmartlinMachineTranslationsApi class tests.", () => {
    const accountUid = "testAccountUid";
    let mtApi;
    let mtApiFetchStub;
    let mtApiUaStub;
    let responseMockTextStub;

    beforeEach(() => {
        mtApi = new SmartlingMachineTranslationsApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);

        mtApiFetchStub = sinon.stub(mtApi, "fetch");
        mtApiUaStub = sinon.stub(mtApi, "ua");
        responseMockTextStub = sinon.stub(responseMock, "text");

        mtApiUaStub.returns("test_user_agent");
        mtApiFetchStub.returns(responseMock);
        responseMockTextStub.returns("{\"response\": {}}");
    });

    afterEach(() => {
        mtApiFetchStub.restore();
        responseMockTextStub.restore();
        mtApiUaStub.restore();
    });

    it("Translate using Smartling MT", async () => {
        const params = new SmartlingMTParameters(
            "en-US",
            "es-ES",
            [{
                key: "text.key",
                sourceText: "This is text for translation"
            }]
        );
        await mtApi.translateUsingSmartlingMT(accountUid, params);

        sinon.assert.calledOnce(mtApiFetchStub);
        sinon.assert.calledWithExactly(
            mtApiFetchStub,
            `https://test.com/mt-router-api/v2/accounts/${accountUid}/smartling-mt`, {
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                },
                method: "post",
                body: JSON.stringify({
                    sourceLocaleId: "en-US",
                    targetLocaleId: "es-ES",
                    items: [{
                        key: "text.key",
                        sourceText: "This is text for translation"
                    }]
                })
            }
        );
    });

    it("Validation of MT parameters throws error when no source items specified", async () => {
        try {
            // eslint-disable-next-line no-new
            new SmartlingMTParameters(
                "en-US",
                "es-ES",
                []
            );
            assert.fail("must throw SmartlingException");
        } catch (e) {
            assert.ok(e instanceof SmartlingException);
        }
    });

    it("Validation of MT parameters throws error when number of source items exceeds limit", async () => {
        try {
            // eslint-disable-next-line no-new
            new SmartlingMTParameters(
                "en-US",
                "es-ES",
                Array(1001).fill({
                    key: "key",
                    sourceText: "string for translation"
                })
            );
            assert.fail("must throw SmartlingException");
        } catch (e) {
            assert.ok(e instanceof SmartlingException);
        }
    });

    it("Validation of MT parameters throws error when source item has empty key", async () => {
        try {
            // eslint-disable-next-line no-new
            new SmartlingMTParameters(
                "en-US",
                "es-ES",
                [{
                    key: "",
                    sourceText: "text"
                }]
            );
            assert.fail("must throw SmartlingException");
        } catch (e) {
            assert.ok(e instanceof SmartlingException);
        }
    });

    it("Validation of MT parameters throws error when source item has long key", async () => {
        try {
            // eslint-disable-next-line no-new
            new SmartlingMTParameters(
                "en-US",
                "es-ES",
                [{
                    key: "A".repeat(256),
                    sourceText: "text"
                }]
            );
            assert.fail("must throw SmartlingException");
        } catch (e) {
            assert.ok(e instanceof SmartlingException);
        }
    });

    it("Validation of MT parameters throws error when source item has empty text", async () => {
        try {
            // eslint-disable-next-line no-new
            new SmartlingMTParameters(
                "en-US",
                "es-ES",
                [{
                    key: "key",
                    sourceText: ""
                }]
            );
            assert.fail("must throw SmartlingException");
        } catch (e) {
            assert.ok(e instanceof SmartlingException);
        }
    });

    it("Validation of MT parameters throws error when source item has long text", async () => {
        try {
            // eslint-disable-next-line no-new
            new SmartlingMTParameters(
                "en-US",
                "es-ES",
                [{
                    key: "key",
                    sourceText: "A".repeat((64 * 1024) + 1)
                }]
            );
            assert.fail("must throw SmartlingException");
        } catch (e) {
            assert.ok(e instanceof SmartlingException);
        }
    });
});
