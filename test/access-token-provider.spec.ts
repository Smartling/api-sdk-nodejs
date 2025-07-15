import assert from "assert";
import { AccessTokenProvider } from "../api/auth/access-token-provider";

describe("AccessTokenProvider", () => {
    const staticToken = "test.jwt.token";

    it("should return the static token response from authenticate", async () => {
        const provider = new AccessTokenProvider(staticToken, "Bearer");
        const response = await provider.authenticate();

        assert.strictEqual(response.accessToken, staticToken);
        assert.strictEqual(response.tokenType, "Bearer");
        assert.strictEqual(response.expiresIn, Number.MAX_SAFE_INTEGER);
        assert.strictEqual(response.refreshToken, "");
        assert.strictEqual(response.refreshExpiresIn, Number.MAX_SAFE_INTEGER);
    });

    it("should return the static token", async () => {
        const provider = new AccessTokenProvider(staticToken, "Bearer");
        const token = await provider.getAccessToken();

        assert.strictEqual(token, staticToken);
    });

    it("should always report token as not expired", () => {
        const provider = new AccessTokenProvider(staticToken, "Bearer");

        assert.strictEqual(provider.tokenExpired(), false);
    });

    it("should always report token as not renewable", () => {
        const provider = new AccessTokenProvider(staticToken, "Bearer");

        assert.strictEqual(provider.tokenCanBeRenewed(), false);
    });
});
