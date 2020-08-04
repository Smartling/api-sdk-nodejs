import sinon from "sinon";
import { BulkRequestServiceApi } from "../api/bulk-request";

const {loggerMock, authMock, responseMock} = require("./mock");

describe("SmartlingBulkRequestServiceApi class tests.", () => {
    let bulkRequestServiceApi: BulkRequestServiceApi;
    let bulkRequestServiceApiFetchStub;
    let bulkRequestServiceApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        bulkRequestServiceApi = new BulkRequestServiceApi(authMock, loggerMock, "https://test.com");
        bulkRequestServiceApiFetchStub = sinon.stub(bulkRequestServiceApi, "fetch");
        bulkRequestServiceApiUaStub = sinon.stub(bulkRequestServiceApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        bulkRequestServiceApiUaStub.returns("test_user_agent");
        bulkRequestServiceApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        bulkRequestServiceApiFetchStub.restore();
        responseMockJsonStub.restore();
        bulkRequestServiceApiUaStub.restore();
    });

    describe("Methods", () => {
    });
});
