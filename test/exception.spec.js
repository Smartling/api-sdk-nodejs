const assert = require("assert");
const SmartlingException = require("../api/exception");

describe("Base class tests.", () => {
    it("Cast to string", () => {
        const nestedException = new SmartlingException("Test nested exception", { foo: "nested" });
        const rootException = new SmartlingException("Test root exception", { root: "value" }, nestedException);

        const result = rootException.toString();

        assert.equal(result.includes("Test root exception, payload={\"root\":\"value\"}, stack=Error: Test root exception"), true);
        assert.equal(result.includes("Test nested exception, payload={\"foo\":\"nested\"}, stack=Error: Test nested exception"), true);
    });
});
