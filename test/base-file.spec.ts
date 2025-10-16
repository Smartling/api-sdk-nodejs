import assert from "assert";
import sinon from "sinon";
import { responseMock } from "./mock";
import { SmartlingBaseFileApi } from "../api/base";

describe("SmartlingBaseFileApi class tests.", () => {
    let mockResponse;

    beforeEach(() => {
        mockResponse = {
            ...responseMock,
            headers: {
                get: sinon.stub().returns(null)
            }
        };
    });

    describe("Methods", () => {
        it("Convert response to dto when response doesn't have headers", async () => {
            const fileWithMetadata = await SmartlingBaseFileApi.downloadResponseToTranslatedFileDto(
                mockResponse as Response
            );

            assert.ok(fileWithMetadata.contentType === undefined);
            assert.ok(fileWithMetadata.fileName === undefined);
            assert.ok(fileWithMetadata.fileContent.byteLength === 1);
        });

        it("Convert response to dto when response has headers", async () => {
            mockResponse.headers.get.onCall(0).returns("application/xml");
            mockResponse.headers.get.onCall(1).returns("attachment; filename=\"test.xml\"");
            mockResponse.headers.get.returns(null);

            const fileWithMetadata = await SmartlingBaseFileApi.downloadResponseToTranslatedFileDto(
                mockResponse as Response
            );

            assert.ok(fileWithMetadata.contentType === "application/xml");
            assert.ok(fileWithMetadata.fileName === "test.xml");
            assert.ok(fileWithMetadata.fileContent.byteLength === 1);
        });

        it("Convert response to dto when file name has quotes", async () => {
            mockResponse.headers.get.onCall(0).returns("application/xml");
            mockResponse.headers.get.onCall(1).returns("attachment; filename=\"test - \\\"phase 1\\\".xml\"");
            mockResponse.headers.get.returns(null);

            const fileWithMetadata = await SmartlingBaseFileApi.downloadResponseToTranslatedFileDto(
                mockResponse as Response
            );

            assert.ok(fileWithMetadata.contentType === "application/xml");
            assert.ok(fileWithMetadata.fileName === "test - \"phase 1\".xml");
            assert.ok(fileWithMetadata.fileContent.byteLength === 1);
        });
    });
});
