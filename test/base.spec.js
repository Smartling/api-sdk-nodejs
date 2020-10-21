const assert = require("assert");
const sinon = require("sinon");
const Base = require("../api/base");
const { loggerMock, authMock, responseMock } = require("./mock");
// eslint-disable-next-line import/no-unresolved
const packageJson = require("../../package.json");

describe("Base class tests.", () => {
    describe("Method getDefaultHeaders", () => {
        let base;
        let baseUaStub;

        beforeEach(() => {
            base = new Base(loggerMock);
            baseUaStub = sinon.stub(base, "ua");
            baseUaStub.returns("test_user_agent");
        });

        afterEach(() => {
            baseUaStub.restore();
        });

        it("Auth api object is set.", async () => {
            base.authApi = authMock;

            const defaultHeaders = await base.getDefaultHeaders();

            sinon.assert.calledOnce(baseUaStub);
            sinon.assert.calledWithExactly(baseUaStub, packageJson.name, packageJson.version);

            assert.deepEqual(defaultHeaders, {
                Authorization: "test_token_type test_access_token",
                "Content-Type": "application/json",
                "User-Agent": "test_user_agent"
            });
        });

        it("Auth api object is not set.", async () => {
            const defaultHeaders = await base.getDefaultHeaders();

            sinon.assert.calledOnce(baseUaStub);
            sinon.assert.calledWithExactly(baseUaStub, packageJson.name, packageJson.version);

            assert.deepEqual(defaultHeaders, {
                "Content-Type": "application/json",
                "User-Agent": "test_user_agent"
            });
        });

        it("Auth api object is set but undefined.", async () => {
            base.authApi = undefined;

            const defaultHeaders = await base.getDefaultHeaders();

            sinon.assert.calledOnce(baseUaStub);
            sinon.assert.calledWithExactly(baseUaStub, packageJson.name, packageJson.version);

            assert.deepEqual(defaultHeaders, {
                "Content-Type": "application/json",
                "User-Agent": "test_user_agent"
            });
        });
    });

    describe("Method makeRequest", () => {
        let base;
        let baseFetchStub;
        let baseGetDefaultHeaderSpy;
        let baseUaStub;
        let baseAlterRequestDataSpy;
        let authResetTokenStub;
        let responseMockTextStub;
        let responseMockJsonStub;

        beforeEach(() => {
            base = new Base(loggerMock);
            base.authApi = authMock;

            baseFetchStub = sinon.stub(base, "fetch");
            baseGetDefaultHeaderSpy = sinon.spy(base, "getDefaultHeaders");
            baseUaStub = sinon.stub(base, "ua");
            baseAlterRequestDataSpy = sinon.spy(base, "alterRequestData");
            authResetTokenStub = sinon.stub(base.authApi, "resetToken");
            responseMockTextStub = sinon.stub(responseMock, "text");
            responseMockJsonStub = sinon.stub(responseMock, "json");

            baseUaStub.returns("test_user_agent");
        });

        afterEach(() => {
            baseFetchStub.restore();
            baseGetDefaultHeaderSpy.restore();
            authResetTokenStub.restore();
            responseMockTextStub.restore();
            responseMockJsonStub.restore();
            baseUaStub.restore();
        });

        it("Success (JSON response, bool result).", async () => {
            const requestVerb = "POST";
            const requestUri = "https://test.com";
            const payload = {
                foo: "bar"
            };

            baseFetchStub.returns(responseMock);
            responseMockJsonStub.returns({
                response: {}
            });

            await base.makeRequest(requestVerb, requestUri, payload);

            sinon.assert.calledOnce(baseGetDefaultHeaderSpy);

            sinon.assert.calledOnce(baseAlterRequestDataSpy);
            sinon.assert.calledWithExactly(
                baseAlterRequestDataSpy,
                requestUri,
                {
                    method: requestVerb,
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    body: payload
                }
            );

            sinon.assert.calledOnce(baseFetchStub);
            sinon.assert.calledWithExactly(baseFetchStub, requestUri, {
                method: requestVerb,
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                },
                body: payload
            });

            sinon.assert.notCalled(authResetTokenStub);
            sinon.assert.notCalled(responseMockTextStub);
            sinon.assert.calledOnce(responseMockJsonStub);
        });

        it("Success (JSON response, object result).", async () => {
            const requestVerb = "POST";
            const requestUri = "https://test.com";
            const payload = {
                foo: "bar"
            };

            baseFetchStub.returns(responseMock);
            responseMockJsonStub.returns({
                response: {
                    data: {}
                }
            });

            await base.makeRequest(requestVerb, requestUri, payload);

            sinon.assert.calledOnce(baseGetDefaultHeaderSpy);

            sinon.assert.calledOnce(baseAlterRequestDataSpy);
            sinon.assert.calledWithExactly(
                baseAlterRequestDataSpy,
                requestUri,
                {
                    method: requestVerb,
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    body: payload
                }
            );

            sinon.assert.calledOnce(baseFetchStub);
            sinon.assert.calledWithExactly(baseFetchStub, requestUri, {
                method: requestVerb,
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                },
                body: payload
            });

            sinon.assert.notCalled(authResetTokenStub);
            sinon.assert.notCalled(responseMockTextStub);
            sinon.assert.calledOnce(responseMockJsonStub);
        });

        it("Success (raw text response).", async () => {
            const requestVerb = "POST";
            const requestUri = "https://test.com";
            const payload = {
                foo: "bar"
            };

            baseFetchStub.returns(responseMock);
            responseMockJsonStub.returns({
                response: {
                    data: {}
                }
            });

            await base.makeRequest(requestVerb, requestUri, payload, true);

            sinon.assert.calledOnce(baseGetDefaultHeaderSpy);

            sinon.assert.calledOnce(baseAlterRequestDataSpy);
            sinon.assert.calledWithExactly(
                baseAlterRequestDataSpy,
                requestUri,
                {
                    method: requestVerb,
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    body: payload
                }
            );

            sinon.assert.calledOnce(baseFetchStub);
            sinon.assert.calledWithExactly(baseFetchStub, requestUri, {
                method: requestVerb,
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                },
                body: payload
            });

            sinon.assert.notCalled(authResetTokenStub);
            sinon.assert.calledOnce(responseMockTextStub);
            sinon.assert.notCalled(responseMockJsonStub);
        });

        it("Success (re-authenticate): GET request.", async () => {
            const response401Mock = {
                status: 401
            };
            const requestVerb = "GET";
            const requestUri = "https://test.com";

            baseFetchStub.onCall(0).returns(response401Mock);
            baseFetchStub.onCall(1).returns(responseMock);
            responseMockJsonStub.returns({
                response: {
                    data: {}
                }
            });

            await base.makeRequest(requestVerb, requestUri);

            sinon.assert.calledTwice(baseGetDefaultHeaderSpy);

            sinon.assert.calledTwice(baseAlterRequestDataSpy);
            sinon.assert.calledWithExactly(
                baseAlterRequestDataSpy,
                requestUri,
                {
                    method: requestVerb,
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    }
                }
            );

            sinon.assert.calledTwice(baseFetchStub);
            sinon.assert.calledWithExactly(baseFetchStub.getCall(0), requestUri, {
                method: requestVerb,
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                }
            });

            sinon.assert.calledOnce(authResetTokenStub);

            sinon.assert.calledWithExactly(baseFetchStub.getCall(1), requestUri, {
                method: requestVerb,
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                }
            });

            sinon.assert.notCalled(responseMockTextStub);
            sinon.assert.calledOnce(responseMockJsonStub);
        });

        it("Success (re-authenticate): non-GET request.", async () => {
            const response401Mock = {
                status: 401
            };
            const requestVerb = "POST";
            const requestUri = "https://test.com";

            baseFetchStub.onCall(0).returns(response401Mock);
            baseFetchStub.onCall(1).returns(responseMock);
            responseMockJsonStub.returns({
                response: {
                    data: {}
                }
            });

            await base.makeRequest(requestVerb, requestUri, {
                foo: "bar"
            });

            sinon.assert.calledTwice(baseGetDefaultHeaderSpy);

            sinon.assert.calledTwice(baseAlterRequestDataSpy);
            sinon.assert.calledWithExactly(
                baseAlterRequestDataSpy,
                requestUri,
                {
                    method: requestVerb,
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    body: {
                        foo: "bar"
                    }
                }
            );

            sinon.assert.calledTwice(baseFetchStub);
            sinon.assert.calledWithExactly(baseFetchStub.getCall(0), requestUri, {
                method: requestVerb,
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                },
                body: {
                    foo: "bar"
                }
            });

            sinon.assert.calledOnce(authResetTokenStub);

            sinon.assert.calledWithExactly(baseFetchStub.getCall(1), requestUri, {
                method: requestVerb,
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                },
                body: {
                    foo: "bar"
                }
            });

            sinon.assert.notCalled(responseMockTextStub);
            sinon.assert.calledOnce(responseMockJsonStub);
        });

        it("GET: success (payload is set).", async () => {
            const requestVerb = "GET";
            const requestUri = "https://test.com";
            const payload = {
                foo: "bar"
            };

            baseFetchStub.returns(responseMock);
            responseMockJsonStub.returns({
                response: {
                    data: {}
                }
            });

            await base.makeRequest(requestVerb, requestUri, payload);

            sinon.assert.calledOnce(baseGetDefaultHeaderSpy);

            sinon.assert.calledOnce(baseAlterRequestDataSpy);
            sinon.assert.calledWithExactly(
                baseAlterRequestDataSpy,
                `${requestUri}?foo=bar`,
                {
                    method: requestVerb,
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    }
                }
            );

            sinon.assert.calledOnce(baseFetchStub);
            sinon.assert.calledWithExactly(baseFetchStub, `${requestUri}?foo=bar`, {
                method: requestVerb,
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                }
            });

            sinon.assert.notCalled(authResetTokenStub);
            sinon.assert.notCalled(responseMockTextStub);
            sinon.assert.calledOnce(responseMockJsonStub);
        });

        it("GET: success (payload is not set).", async () => {
            const requestVerb = "GET";
            const requestUri = "https://test.com";

            baseFetchStub.returns(responseMock);
            responseMockJsonStub.returns({
                response: {
                    data: {}
                }
            });

            await base.makeRequest(requestVerb, requestUri);

            sinon.assert.calledOnce(baseGetDefaultHeaderSpy);

            sinon.assert.calledOnce(baseAlterRequestDataSpy);
            sinon.assert.calledWithExactly(
                baseAlterRequestDataSpy,
                requestUri,
                {
                    method: requestVerb,
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    }
                }
            );

            sinon.assert.calledOnce(baseFetchStub);
            sinon.assert.calledWithExactly(baseFetchStub, requestUri, {
                method: requestVerb,
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                }
            });

            sinon.assert.notCalled(authResetTokenStub);
            sinon.assert.notCalled(responseMockTextStub);
            sinon.assert.calledOnce(responseMockJsonStub);
        });

        it("Custom options for api object (timeout)", async () => {
            const requestVerb = "POST";
            const requestUri = "https://test.com";
            const payload = {
                foo: "bar"
            };

            baseFetchStub.returns(responseMock);
            responseMockJsonStub.returns({
                response: {
                    data: {}
                }
            });

            base.setOptions({
                timeout: 10000,
                headers: {
                    foo: "bar"
                }
            });

            await base.makeRequest(requestVerb, requestUri, payload);

            sinon.assert.calledOnce(baseGetDefaultHeaderSpy);

            sinon.assert.calledOnce(baseAlterRequestDataSpy);
            sinon.assert.calledWithExactly(
                baseAlterRequestDataSpy,
                requestUri,
                {
                    method: requestVerb,
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent",
                        foo: "bar"
                    },
                    body: payload,
                    timeout: 10000
                }
            );

            sinon.assert.calledOnce(baseFetchStub);
            sinon.assert.calledWithExactly(baseFetchStub, requestUri, {
                method: requestVerb,
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent",
                    foo: "bar"
                },
                body: payload,
                timeout: 10000
            });

            sinon.assert.notCalled(authResetTokenStub);
            sinon.assert.notCalled(responseMockTextStub);
            sinon.assert.calledOnce(responseMockJsonStub);
        });

        it("Fail (non 200/401 response).", async () => {
            const response400Mock = {
                status: 400,
                text: () => ({ response: { code: "VALIDATION_ERROR", errors: [] } }),
                headers: {
                    get: () => "test-request-id"
                }
            };
            const requestVerb = "POST";
            const requestUri = "https://test.com";
            const payload = {
                foo: "bar"
            };

            baseFetchStub.returns(response400Mock);
            responseMockJsonStub.returns({
                response: {
                    data: {}
                }
            });

            try {
                await base.makeRequest(requestVerb, requestUri, payload);

                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Request for https://test.com failed");
                assert.deepEqual(e.payload, "{\"statusCode\":400,\"errorResponse\":{\"response\":{\"code\":\"VALIDATION_ERROR\",\"errors\":[]}},\"requestId\":\"test-request-id\"}");
                assert.equal(e.nestedException, null);
            } finally {
                sinon.assert.calledOnce(baseGetDefaultHeaderSpy);

                sinon.assert.calledOnce(baseAlterRequestDataSpy);
                sinon.assert.calledWithExactly(
                    baseAlterRequestDataSpy,
                    requestUri,
                    {
                        method: requestVerb,
                        headers: {
                            Authorization: "test_token_type test_access_token",
                            "Content-Type": "application/json",
                            "User-Agent": "test_user_agent"
                        },
                        body: payload
                    }
                );

                sinon.assert.calledOnce(baseFetchStub);
                sinon.assert.calledWithExactly(baseFetchStub, requestUri, {
                    method: requestVerb,
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    body: payload
                });

                sinon.assert.notCalled(authResetTokenStub);
                sinon.assert.notCalled(responseMockTextStub);
                sinon.assert.notCalled(responseMockJsonStub);
            }
        });

        it("Fail (json parsing failed).", async () => {
            const error = new Error("Json parse test error.");
            const requestVerb = "POST";
            const requestUri = "https://test.com";
            const payload = {
                foo: "bar"
            };

            responseMock.headers = {
                get: () => "test-request-id"
            };

            baseFetchStub.returns(responseMock);
            responseMockJsonStub.throws(error);
            responseMockTextStub.resolves("error");

            try {
                await base.makeRequest(requestVerb, requestUri, payload);

                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Couldn't parse response json");
                assert.deepEqual(e.payload, "{\"statusCode\":200,\"errorResponse\":\"error\",\"requestId\":\"test-request-id\"}");
            } finally {
                sinon.assert.calledOnce(baseGetDefaultHeaderSpy);

                sinon.assert.calledOnce(baseAlterRequestDataSpy);
                sinon.assert.calledWithExactly(
                    baseAlterRequestDataSpy,
                    requestUri,
                    {
                        method: requestVerb,
                        headers: {
                            Authorization: "test_token_type test_access_token",
                            "Content-Type": "application/json",
                            "User-Agent": "test_user_agent"
                        },
                        body: payload
                    }
                );

                sinon.assert.calledOnce(baseFetchStub);
                sinon.assert.calledWithExactly(baseFetchStub, requestUri, {
                    method: requestVerb,
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    body: payload
                });

                sinon.assert.notCalled(authResetTokenStub);
                sinon.assert.calledOnce(responseMockTextStub);
                sinon.assert.calledOnce(responseMockJsonStub);
            }
        });
    });
});
