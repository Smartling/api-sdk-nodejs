const assert = require("assert");
import { AccessTokenProvider } from "../api/auth/access-token-provider";

describe("Auth class tests.", () => {
    it("Access token provider", async () => {
        const accessTokenProvider = new AccessTokenProvider("accessToken", "tokenType");

        assert.equal(
            await accessTokenProvider.getAccessToken(),
            "accessToken"
        );

        assert.equal(
            await accessTokenProvider.getTokenType(),
            "tokenType"
        );
    });
});
