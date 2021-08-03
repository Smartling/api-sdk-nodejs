import sinon from "sinon";
import assert from "assert";
import { SmartlingProjectsApi } from "../api/projects";
import { loggerMock, authMock, responseMock } from "./mock";

const projectId = "testProjectId";
const fileUri = "testStringsFileUri";
const limit = 25;
const offset = 0;

const hashCodes = ["testStringHashCode1", "testStringHashCode2"];
const hashCodesParams = hashCodes.map(hashCode => `hashcodes=${hashCode}`).join('&')

describe("SmartlingStringsApi class tests.", () => {
    let projectsApi: SmartlingProjectsApi;
    let projectsApiFetchStub;
    let projectsApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        projectsApi = new SmartlingProjectsApi(authMock as any, loggerMock, "https://test.com");
        projectsApiFetchStub = sinon.stub(projectsApi, "fetch");
        projectsApiUaStub = sinon.stub(projectsApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        projectsApiUaStub.returns("test_user_agent");
        projectsApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        projectsApiFetchStub.restore();
        responseMockJsonStub.restore();
        projectsApiUaStub.restore();
    });

    describe("Methods", () => {
        it("Fetch source strings", async () => {
            await projectsApi.getProjectDetails(projectId);

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                `https://test.com/projects-api/v2/projects/${projectId}`,
                {
                    headers: {
                        "Authorization": "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });
    });
});
