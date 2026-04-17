import assert from "assert";
import sinon from "sinon";
import { SmartlingBaseApi } from "../api/base/index";
import { merge } from "../api/base/base-api";
import { loggerMock, responseMock, authMock } from "./mock";

// CON-2075: pins the deep-merge semantics SmartlingBaseApi relies on across the
// swap from merge-deep to deepmerge. Library-level cases exercise the exported
// `merge` helper directly so the tests pin behavior at the same entry point
// the production code uses.

describe("Deep merge behavior (CON-2075).", () => {
    describe("Library-level behavior (direct merge calls)", () => {
        it("overrides a target primitive with the source primitive at the same key", () => {
            assert.deepEqual(merge({ a: 1 }, { a: 2 }), { a: 2 });
        });

        it("combines disjoint keys from target and source", () => {
            assert.deepEqual(merge({ a: 1 }, { b: 2 }), { a: 1, b: 2 });
        });

        it("recursively merges one level of nested objects; source wins on conflicts", () => {
            assert.deepEqual(
                merge(
                    { headers: { Authorization: "a", "Content-Type": "json" } },
                    { headers: { "Content-Type": "xml", "X-Custom": "x" } }
                ),
                {
                    headers: {
                        Authorization: "a",
                        "Content-Type": "xml",
                        "X-Custom": "x"
                    }
                }
            );
        });

        it("recursively merges multi-level nested objects", () => {
            assert.deepEqual(
                merge({ a: { b: { c: 1, d: 2 } } }, { a: { b: { d: 20, e: 3 } } }),
                { a: { b: { c: 1, d: 20, e: 3 } } }
            );
        });

        it("replaces a target primitive with a source object at the same key", () => {
            assert.deepEqual(merge({ a: 1 }, { a: { b: 2 } }), { a: { b: 2 } });
        });

        it("does not mutate the target object", () => {
            const target = { a: 1, b: { c: 2 } };
            const snapshot = JSON.parse(JSON.stringify(target));
            merge(target, { b: { d: 3 } });
            assert.deepEqual(target, snapshot);
        });

        it("does not mutate the source object", () => {
            const source = { b: { d: 3 } };
            const snapshot = JSON.parse(JSON.stringify(source));
            merge({ a: 1 }, source);
            assert.deepEqual(source, snapshot);
        });

        it("returns a new object rather than a reference to either input", () => {
            const target = { a: { b: 1 } };
            const source = { c: 2 };
            const result = merge(target, source);
            assert.notStrictEqual(result, target);
            assert.notStrictEqual(result.a, target.a);
        });

        it("returns the source content when target is empty", () => {
            assert.deepEqual(merge({}, { a: 1, b: { c: 2 } }), { a: 1, b: { c: 2 } });
        });

        it("returns the target content when source is empty", () => {
            assert.deepEqual(merge({ a: 1, b: { c: 2 } }, {}), { a: 1, b: { c: 2 } });
        });

        it("concatenates disjoint arrays at the same key in source order", () => {
            assert.deepEqual(
                merge({ items: ["a"] }, { items: ["b", "c"] }),
                { items: ["a", "b", "c"] }
            );
        });

        it("de-duplicates overlapping array values while preserving order (merge-deep array-union semantics)", () => {
            // merge-deep delegates array handling to arr-union, so repeated
            // values are collapsed. deepmerge does plain concat by default, so
            // the swap must supply a custom arrayMerge to preserve this.
            assert.deepEqual(
                merge({ items: [1, 2, 3] }, { items: [2, 3, 4] }),
                { items: [1, 2, 3, 4] }
            );
        });

        it("concatenates arrays at nested paths with the same union semantics", () => {
            assert.deepEqual(
                merge({ group: { items: [1, 2] } }, { group: { items: [2, 3] } }),
                { group: { items: [1, 2, 3] } }
            );
        });
    });

    describe("SmartlingBaseApi integration (pins the call-site behavior)", () => {
        let base;
        let uaStub;

        beforeEach(() => {
            base = new SmartlingBaseApi(loggerMock);
            base.authApi = authMock;
            uaStub = sinon.stub(base, "ua");
            uaStub.returns("test_user_agent");
        });

        afterEach(() => {
            uaStub.restore();
        });

        it("getDefaultHeaders: caller-supplied Content-Type overrides the default", async () => {
            const headers = await base.getDefaultHeaders({
                "Content-Type": "application/xml"
            });

            assert.deepEqual(headers, {
                Authorization: "test_token_type test_access_token",
                "Content-Type": "application/xml",
                "User-Agent": "test_user_agent"
            });
        });

        it("getDefaultHeaders: caller-supplied Authorization overrides the default", async () => {
            const headers = await base.getDefaultHeaders({ Authorization: "Bearer custom" });

            assert.equal(headers.Authorization, "Bearer custom");
            assert.equal(headers["Content-Type"], "application/json");
            assert.equal(headers["User-Agent"], "test_user_agent");
        });

        it("getDefaultHeaders: adds new caller-supplied keys while preserving defaults", async () => {
            const headers = await base.getDefaultHeaders({
                "X-SL-ServiceOrigin": "foo",
                "X-Request-Id": "abc-123"
            });

            assert.deepEqual(headers, {
                Authorization: "test_token_type test_access_token",
                "Content-Type": "application/json",
                "User-Agent": "test_user_agent",
                "X-SL-ServiceOrigin": "foo",
                "X-Request-Id": "abc-123"
            });
        });

        it("makeRequest: nested non-header option fields survive the options merge", async () => {
            const fetchStub = sinon.stub(base, "fetch").returns(responseMock);
            const textStub = sinon.stub(responseMock, "text").returns("{\"response\": {\"data\": {}}}");

            try {
                base.setOptions({
                    timeout: 10000,
                    agent: { keepAlive: true, maxSockets: 50 }
                });

                await base.makeRequest("POST", "https://test.com", { foo: "bar" });

                const passedOpts = fetchStub.firstCall.args[1];
                assert.equal(passedOpts.timeout, 10000);
                assert.deepEqual(passedOpts.agent, { keepAlive: true, maxSockets: 50 });
                assert.equal(passedOpts.method, "POST");
            } finally {
                textStub.restore();
                fetchStub.restore();
            }
        });

        it("makeRequest: options.headers deep-merge with the default headers (source wins on conflicts)", async () => {
            const fetchStub = sinon.stub(base, "fetch").returns(responseMock);
            const textStub = sinon.stub(responseMock, "text").returns("{\"response\": {\"data\": {}}}");

            try {
                base.setOptions({
                    headers: {
                        "X-SL-ServiceOrigin": "foo-bar",
                        "Content-Type": "application/xml"
                    }
                });

                await base.makeRequest("POST", "https://test.com", { foo: "bar" });

                const passedOpts = fetchStub.firstCall.args[1];
                assert.deepEqual(passedOpts.headers, {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/xml",
                    "User-Agent": "test_user_agent",
                    "X-SL-ServiceOrigin": "foo-bar"
                });
            } finally {
                textStub.restore();
                fetchStub.restore();
            }
        });

        it("makeRequest: calling setOptions twice does not accumulate stale state on the caller-provided object", async () => {
            const fetchStub = sinon.stub(base, "fetch").returns(responseMock);
            const textStub = sinon.stub(responseMock, "text").returns("{\"response\": {\"data\": {}}}");

            try {
                const userOptions = { headers: { "X-Custom": "first" } };
                base.setOptions(userOptions);

                await base.makeRequest("POST", "https://test.com", { foo: "bar" });

                // The object the user passed to setOptions must be unchanged
                // by the merge the SDK does internally.
                assert.deepEqual(userOptions, { headers: { "X-Custom": "first" } });
            } finally {
                textStub.restore();
                fetchStub.restore();
            }
        });
    });
});
