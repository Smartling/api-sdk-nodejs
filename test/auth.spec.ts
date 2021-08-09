import sinon from "sinon";
import assert from "assert";
import { SmartlingAuthApi } from "../api/auth/index";
import { loggerMock, responseMock } from "./mock";
import { SmartlingException } from "../api/exception/index";

describe("Auth class tests.", () => {
    let auth;
    let authMakeRequestStub;
    let authResetRequestTimeStampSpy;

    beforeEach(() => {
        auth = new SmartlingAuthApi("https://api.smartling.com", "test_user_id", "test_user_secret", loggerMock);

        authMakeRequestStub = sinon.stub(auth, "makeRequest");
        authResetRequestTimeStampSpy = sinon.spy(auth, "resetRequestTimeStamp");
    });

    afterEach(() => {
        authMakeRequestStub.restore();
        authResetRequestTimeStampSpy.restore();
    });

    describe("Method authenticate.", () => {
        it("Success flow", async () => {
            await auth.authenticate();

            sinon.assert.calledOnce(authResetRequestTimeStampSpy);

            sinon.assert.calledOnce(authMakeRequestStub);
            sinon.assert.calledWithExactly(
                authMakeRequestStub,
                "post",
                "https://api.smartling.com/auth-api/v2/authenticate",
                "{\"userIdentifier\":\"test_user_id\",\"userSecret\":\"test_user_secret\"}"
            );
        });

        it("Auth endpoint returned non-200 response code", async () => {
            authMakeRequestStub.restore();

            const baseFetchStub = sinon.stub(auth, "fetch");
            const response401Mock = {
                status: 401
            };

            baseFetchStub.onCall(0).returns(response401Mock);
            baseFetchStub.onCall(1).returns(responseMock);

            await auth.authenticate();
        });
    });

    describe("Method refreshToken.", () => {
        let authTokenExistsStub;
        let authTokenCanBeRenewedStub;
        let authAuthenticateStub;

        beforeEach(() => {
            authTokenExistsStub = sinon.stub(auth, "tokenExists");
            authTokenCanBeRenewedStub = sinon.stub(auth, "tokenCanBeRenewed");
            authAuthenticateStub = sinon.stub(auth, "authenticate");
        });

        afterEach(() => {
            authTokenExistsStub.restore();
            authTokenCanBeRenewedStub.restore();
            authAuthenticateStub.restore();
        });

        it("Token exists and can be renewed.", async () => {
            authTokenExistsStub.returns(true);
            authTokenCanBeRenewedStub.returns(true);
            auth.response = { refreshToken: "test_refresh_token" };

            await auth.refreshToken();

            sinon.assert.calledOnce(authTokenExistsStub);
            sinon.assert.calledOnce(authTokenCanBeRenewedStub);
            sinon.assert.calledOnce(authResetRequestTimeStampSpy);

            sinon.assert.calledOnce(authMakeRequestStub);
            sinon.assert.calledWithExactly(
                authMakeRequestStub,
                "post",
                "https://api.smartling.com/auth-api/v2/authenticate/refresh",
                "{\"refreshToken\":\"test_refresh_token\"}"
            );

            sinon.assert.notCalled(authAuthenticateStub);
        });

        it("Token exists but can't be renewed.", async () => {
            authTokenExistsStub.returns(true);
            authTokenCanBeRenewedStub.returns(false);
            auth.response = { refreshToken: "test_refresh_token" };

            await auth.refreshToken();

            sinon.assert.calledOnce(authTokenExistsStub);
            sinon.assert.calledOnce(authTokenCanBeRenewedStub);
            sinon.assert.notCalled(authResetRequestTimeStampSpy);
            sinon.assert.notCalled(authMakeRequestStub);
            sinon.assert.calledOnce(authAuthenticateStub);
        });

        it("Token doesn't exist but can be renewed.", async () => {
            authTokenExistsStub.returns(false);
            authTokenCanBeRenewedStub.returns(true);
            auth.response = { refreshToken: "test_refresh_token" };

            await auth.refreshToken();

            sinon.assert.calledOnce(authTokenExistsStub);
            sinon.assert.notCalled(authTokenCanBeRenewedStub);
            sinon.assert.notCalled(authResetRequestTimeStampSpy);
            sinon.assert.notCalled(authMakeRequestStub);
            sinon.assert.calledOnce(authAuthenticateStub);
        });

        it("Token doesn't exist and can't be renewed.", async () => {
            authTokenExistsStub.returns(false);
            authTokenCanBeRenewedStub.returns(false);
            auth.response = { refreshToken: "test_refresh_token" };

            await auth.refreshToken();

            sinon.assert.calledOnce(authTokenExistsStub);
            sinon.assert.notCalled(authTokenCanBeRenewedStub);
            sinon.assert.notCalled(authResetRequestTimeStampSpy);
            sinon.assert.notCalled(authMakeRequestStub);
            sinon.assert.calledOnce(authAuthenticateStub);
        });
    });

    it("Method resetToken.", async () => {
        auth.requestTimestamp = 1234567890;
        auth.response = { foo: "bar" };

        auth.resetToken();

        assert.equal(auth.requestTimestamp, 0);
        assert.deepEqual(auth.response, null);
    });

    describe("Method getAccessToken.", () => {
        let authTokenExpiredStub;
        let authRefreshTokenStub;
        let authTokenExistsStub;
        let authAuthenticateStub;

        beforeEach(() => {
            authTokenExpiredStub = sinon.stub(auth, "tokenExpired");
            authRefreshTokenStub = sinon.stub(auth, "refreshToken");
            authTokenExistsStub = sinon.stub(auth, "tokenExists");
            authAuthenticateStub = sinon.stub(auth, "authenticate");
        });

        afterEach(() => {
            authTokenExpiredStub.restore();
            authRefreshTokenStub.restore();
            authTokenExistsStub.restore();
            authAuthenticateStub.restore();
        });

        it("Token is not expired and does exist.", async () => {
            authTokenExpiredStub.returns(false);
            authTokenExistsStub.returns(true);

            auth.response = { accessToken: "foo" };

            await auth.getAccessToken();

            sinon.assert.calledOnce(authTokenExpiredStub);
            sinon.assert.notCalled(authRefreshTokenStub);
            sinon.assert.calledOnce(authTokenExistsStub);
            sinon.assert.notCalled(authAuthenticateStub);
        });

        it("Token is expired and doesn't exist.", async () => {
            authTokenExpiredStub.returns(true);
            authTokenExistsStub.returns(false);

            authAuthenticateStub.returns({ accessToken: "foo" });

            await auth.getAccessToken();

            sinon.assert.calledOnce(authTokenExpiredStub);
            sinon.assert.calledOnce(authRefreshTokenStub);
            sinon.assert.calledOnce(authTokenExistsStub);
            sinon.assert.calledOnce(authAuthenticateStub);
        });

        it("Token is expired and exists.", async () => {
            authTokenExpiredStub.returns(true);
            authTokenExistsStub.returns(true);

            authRefreshTokenStub.returns({ accessToken: "foo" });

            await auth.getAccessToken();

            sinon.assert.calledOnce(authTokenExpiredStub);
            sinon.assert.calledOnce(authRefreshTokenStub);
            sinon.assert.calledOnce(authTokenExistsStub);
            sinon.assert.notCalled(authAuthenticateStub);
        });

        it("Token is not expired and doesn't exist.", async () => {
            authTokenExpiredStub.returns(false);
            authTokenExistsStub.returns(false);

            authAuthenticateStub.returns({ accessToken: "foo" });

            await auth.getAccessToken();

            sinon.assert.calledOnce(authTokenExpiredStub);
            sinon.assert.notCalled(authRefreshTokenStub);
            sinon.assert.calledOnce(authTokenExistsStub);
            sinon.assert.calledOnce(authAuthenticateStub);
        });

        it("Refresh token request failed: final attempt to authenticate succeeds.", async () => {
            const error = new SmartlingException("Test exception", { foo: "bar" });

            authTokenExpiredStub.returns(true);
            authRefreshTokenStub.throws(error);

            authAuthenticateStub.returns({ accessToken: "foo" });

            assert.equal(await auth.getAccessToken(), "foo");
            assert.deepEqual(auth.response, {
                accessToken: "foo"
            });

            sinon.assert.calledOnce(authTokenExpiredStub);
            sinon.assert.calledOnce(authRefreshTokenStub);
            sinon.assert.notCalled(authTokenExistsStub);
            sinon.assert.calledOnce(authAuthenticateStub);
        });

        it("Refresh token request failed: final attempt to authenticate fails.", async () => {
            const refreshError = new SmartlingException("Refresh failed", { foo: "bar" });
            const authError = new SmartlingException("Auth failed", { foo: "bar" });

            authTokenExpiredStub.returns(true);
            authRefreshTokenStub.throws(refreshError);
            authAuthenticateStub.throws(authError);

            try {
                await auth.getAccessToken();

                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Failed to get access token");
                assert.deepEqual(e.payload, { foo: "bar" });
                assert.equal(e.nestedException, authError);
            } finally {
                sinon.assert.calledOnce(authTokenExpiredStub);
                sinon.assert.calledOnce(authRefreshTokenStub);
                sinon.assert.notCalled(authTokenExistsStub);
                sinon.assert.calledOnce(authAuthenticateStub);
            }
        });
    });

    describe("Method getTokenType.", () => {
        let authTokenExistsSpy;
        let authAuthenticateStub;

        beforeEach(() => {
            authTokenExistsSpy = sinon.spy(auth, "tokenExists");
            authAuthenticateStub = sinon.stub(auth, "authenticate");
        });

        afterEach(() => {
            authTokenExistsSpy.restore();
            authAuthenticateStub.restore();
        });

        it("Token exists.", async () => {
            auth.response = {
                accessToken: "test_access_token",
                tokenType: "test_token_type"
            };

            const result = await auth.getTokenType();

            sinon.assert.calledOnce(authTokenExistsSpy);
            sinon.assert.notCalled(authAuthenticateStub);

            assert.equal(result, "test_token_type");
        });

        it("Token doesn't exist: re-auth failed.", async () => {
            authAuthenticateStub.throws(new SmartlingException("Failed to get token type"));

            try {
                await auth.getTokenType();

                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Failed to get token type");
            } finally {
                sinon.assert.calledOnce(authTokenExistsSpy);
                sinon.assert.calledOnce(authAuthenticateStub);
            }
        });

        it("Token doesn't exist: re-auth succeeded.", async () => {
            authAuthenticateStub.returns({
                accessToken: "test_access_token",
                tokenType: "test_token_type"
            });

            const result = await auth.getTokenType();

            sinon.assert.calledOnce(authTokenExistsSpy);
            sinon.assert.calledOnce(authAuthenticateStub);

            assert.equal(result, "test_token_type");
        });
    });

    describe("Method tokenExists.", () => {
        it("Response object is set and contains 'accessToken' property.", async () => {
            auth.response = {
                accessToken: "test_access_token"
            };

            assert.equal(auth.tokenExists(), true);
        });

        it("Response object is set but 'accessToken' property is missing.", async () => {
            auth.response = {
                foo: "bar"
            };

            assert.equal(auth.tokenExists(), false);
        });

        it("Response object is not set.", async () => {
            assert.equal(auth.tokenExists(), false);
        });
    });

    describe("Method tokenExpired", () => {
        let authTokenExistsStub;

        beforeEach(() => {
            authTokenExistsStub = sinon.stub(auth, "tokenExists");
        });

        afterEach(() => {
            authTokenExistsStub.restore();
        });

        it("Expired: token exists and current time > token expiration time.", () => {
            const time = auth.time();
            authTokenExistsStub.returns(true);

            auth.requestTimestamp = time - 120;
            auth.response = { expiresIn: 100 };

            assert.equal(auth.tokenExpired(), true);
        });

        it("Not expired: token exists and current time <= token expiration time.", () => {
            const time = auth.time();
            authTokenExistsStub.returns(true);

            auth.requestTimestamp = time;
            auth.response = { expiresIn: 100 };

            assert.equal(auth.tokenExpired(), false);
        });

        it("Not expired: token doesn't exist.", () => {
            authTokenExistsStub.returns(false);

            assert.equal(auth.tokenExpired(), false);
        });
    });

    describe("Method tokenCanBeRenewed", () => {
        let authTokenExistsStub;

        beforeEach(() => {
            authTokenExistsStub = sinon.stub(auth, "tokenExists");
        });

        afterEach(() => {
            authTokenExistsStub.restore();
        });

        it("Can be renewed: token exists and current time < request time stamp + 'response.refreshExpiresIn'.", () => {
            const time = auth.time();
            authTokenExistsStub.returns(true);

            auth.requestTimestamp = time;
            auth.response = { refreshExpiresIn: 100 };

            assert.equal(auth.tokenCanBeRenewed(), true);
        });

        it("Can't be renewed: token exists and current time >= request time stamp + 'response.refreshExpiresIn'.", () => {
            const time = auth.time();
            authTokenExistsStub.returns(true);

            auth.requestTimestamp = time - 120;
            auth.response = { refreshExpiresIn: 100 };

            assert.equal(auth.tokenCanBeRenewed(), false);
        });

        it("Can't be renewed: token doesn't exist.", () => {
            authTokenExistsStub.returns(false);

            assert.equal(auth.tokenCanBeRenewed(), false);
        });
    });
});
