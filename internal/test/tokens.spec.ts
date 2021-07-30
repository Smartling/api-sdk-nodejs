import sinon from "sinon";
import fs from "fs";
import assert from "assert";
import { SmartlingTokensApi } from "../api/tokens";

const { loggerMock, authMock, responseMock } = require("./mock");

describe("Tokens api class tests.", () => {
    let tokensApi;
    let tokensApiFetchStub;
    let tokensApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        tokensApi = new SmartlingTokensApi(authMock, loggerMock, "https://test.com");
        tokensApi.authApi = authMock;

        tokensApiFetchStub = sinon.stub(tokensApi, "fetch");
        tokensApiUaStub = sinon.stub(tokensApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        tokensApiUaStub.returns("test_user_agent");
        tokensApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        tokensApiFetchStub.restore();
        responseMockJsonStub.restore();
        tokensApiUaStub.restore();
    });

    it("Create account level api token", async () => {
        await tokensApi.createAccountLevelApiToken("test_account", "test_token", "test_uid");

        sinon.assert.calledOnce(tokensApiFetchStub);
        sinon.assert.calledWithExactly(
            tokensApiFetchStub,
            "https://test.com/tokens-api/v2/accounts/test_account/tokens", {
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                },
                method: "post",
                body: "{\"tokenName\":\"test_token\",\"uid\":\"test_uid\"}"
            }
        );
    });

    it("Create project level api token", async () => {
        await tokensApi.createProjectLevelApiToken("test_project", "test_token", "test_uid");

        sinon.assert.calledOnce(tokensApiFetchStub);
        sinon.assert.calledWithExactly(
            tokensApiFetchStub,
            "https://test.com/tokens-api/v2/projects/test_project/tokens", {
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                },
                method: "post",
                body: "{\"tokenName\":\"test_token\",\"uid\":\"test_uid\"}"
            }
        );
    });
});
