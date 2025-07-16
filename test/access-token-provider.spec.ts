import assert from "assert";
import { AccessTokenProvider } from "../api/auth/access-token-provider";

describe("AccessTokenProvider", () => {
    const staticToken = "test.jwt.token";

    it("should return the static token and token type", async () => {
        const provider = new AccessTokenProvider(staticToken, "Bearer");
        const response = await provider.getAccessToken();

        assert.strictEqual(await provider.getAccessToken(), staticToken);
        assert.strictEqual(await provider.getTokenType(), "Bearer");
    });
});
