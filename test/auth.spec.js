const assert = require("assert");
const sinon = require("sinon");
const Auth = require("../api/auth");
const SmartlingException = require("../api/exception");

const loggerMock = {
    debug: () => {},
    warn: () => {},
    error: () => {},
    info: () => {}
};

describe("Auth class tests.", () => {
    let auth;
    let authMakeRequestStub;
    let authResetRequestTimeStampSpy;

    beforeEach(() => {
        auth = new Auth("test_user_id", "test_user_secret", loggerMock, "https://api.smartling.com");

        authMakeRequestStub = sinon.stub(auth, "makeRequest");
        authResetRequestTimeStampSpy = sinon.spy(auth, "resetRequestTimeStamp");
    });

    afterEach(() => {
        authMakeRequestStub.restore();
        authResetRequestTimeStampSpy.restore();
    });

    it("Method authenticate.", async () => {
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
        assert.deepEqual(auth.response, {});
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

        it("Request failed.", async () => {
            const error = new SmartlingException("Test exception", { foo: "bar" });

            authTokenExpiredStub.returns(true);
            authRefreshTokenStub.throws(error);

            authAuthenticateStub.returns({ accessToken: "foo" });

            try {
                await auth.getAccessToken();

                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Failed to get access token");
                assert.deepEqual(e.payload, { foo: "bar" });
                assert.equal(e.nestedException, error);
            } finally {
                sinon.assert.calledOnce(authTokenExpiredStub);
                sinon.assert.calledOnce(authRefreshTokenStub);
                sinon.assert.notCalled(authTokenExistsStub);
                sinon.assert.notCalled(authAuthenticateStub);
            }
        });
    });

    describe("Method getTokenType.", () => {
        let authTokenExistsStub;
        let authAuthenticateStub;

        beforeEach(() => {
            authTokenExistsStub = sinon.stub(auth, "tokenExists");
            authAuthenticateStub = sinon.stub(auth, "authenticate");
        });

        afterEach(() => {
            authTokenExistsStub.restore();
            authAuthenticateStub.restore();
        });

        it("Token exists.", async () => {
            auth.response = { tokenType: "test_token_type" };
            authTokenExistsStub.returns(true);

            await auth.getTokenType();

            sinon.assert.calledOnce(authTokenExistsStub);
            sinon.assert.calledOnce(authAuthenticateStub);
        });

        it("Token doesn't exist.", async () => {
            authTokenExistsStub.returns(false);

            try {
                await auth.getTokenType();

                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "No tokenType found in response: {}");
                assert.deepEqual(e.payload, null);
                assert.equal(e.nestedException, null);
            } finally {
                sinon.assert.calledOnce(authTokenExistsStub);
                sinon.assert.notCalled(authAuthenticateStub);
            }
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
