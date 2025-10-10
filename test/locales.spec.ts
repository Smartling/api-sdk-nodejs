import sinon from "sinon";
import { SmartlingLocalesApi } from "../api/locales";
import { GetLocalesParameters } from "../api/locales/params/get-locales-parameters";
import { SmartlingAuthApi } from "../api/auth/index";
import { loggerMock, authMock, responseMock } from "./mock";

describe("SmartlingLocalesApi class tests.", () => {
    let localesApi;
    let localesApiFetchStub;
    let localesApiUaStub;
    let responseMockTextStub;

    beforeEach(() => {
        localesApi = new SmartlingLocalesApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);

        localesApiFetchStub = sinon.stub(localesApi, "fetch");
        localesApiUaStub = sinon.stub(localesApi, "ua");
        responseMockTextStub = sinon.stub(responseMock, "text");

        localesApiUaStub.returns("test_user_agent");
        localesApiFetchStub.returns(responseMock);
        responseMockTextStub.returns("{\"response\": {}}");
    });

    afterEach(() => {
        localesApiFetchStub.restore();
        responseMockTextStub.restore();
        localesApiUaStub.restore();
    });

    it("Get all locales", async () => {
        await localesApi.getLocales();

        sinon.assert.calledOnce(localesApiFetchStub);
        sinon.assert.calledWithExactly(
            localesApiFetchStub,
            "https://test.com/locales-api/v2/dictionary/locales",
            {
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                },
                method: "get"
            }
        );
    });

    it("Get locales with filters", async () => {
        const params = new GetLocalesParameters()
            .setLocaleIds(["fr-FR", "de-DE"])
            .setSupportedOnly(true);

        await localesApi.getLocales(params);

        sinon.assert.calledOnce(localesApiFetchStub);
        sinon.assert.calledWithExactly(
            localesApiFetchStub,
            "https://test.com/locales-api/v2/dictionary/locales?localeIds=fr-FR&localeIds=de-DE&supportedOnly=true",
            {
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
