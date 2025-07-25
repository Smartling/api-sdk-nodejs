import assert from "assert";
import { StaticAccessTokenProvider } from "../api/auth/static-access-token-provider";

describe("AccessTokenProvider", () => {
    const staticToken = "test.jwt.token";

    it("should return the static token and token type", async () => {
        const provider = new StaticAccessTokenProvider(staticToken, "Bearer");

        assert.strictEqual(await provider.getAccessToken(), staticToken);
        assert.strictEqual(await provider.getTokenType(), "Bearer");
    });
});
