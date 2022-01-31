import assert from "assert";
import { SmartlingException } from "../api/exception/index";

describe("Exception base class tests.", () => {
    it("Cast to string", () => {
        const nestedException = new SmartlingException("Test nested exception", { foo: "nested" });
        const rootException = new SmartlingException("Test root exception", { root: "value" }, nestedException);

        const result = rootException.toString();

        assert.equal(result.includes("Test root exception, payload={\"root\":\"value\"}, stack=Error: Test root exception"), true);
        assert.equal(result.includes("Test nested exception, payload={\"foo\":\"nested\"}, stack=Error: Test nested exception"), true);
        assert.deepEqual(rootException.getPayload(), { root: "value" });
        assert.deepEqual(rootException.getNestedException(), nestedException);
        assert.deepEqual((rootException.getNestedException() as SmartlingException).getPayload(), { foo: "nested" });
    });
});
