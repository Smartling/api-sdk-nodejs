import sinon from "sinon";
import { SmartlingProjectsApi } from "../api/projects/index";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingAuthApi } from "../api/auth/index";
import { ListProjectsParameters } from "../api/projects/params/list-projects-parameters";

describe("SmartlingProjectsApi class tests.", () => {
    const projectId = "testProjectId";
    let projectsApi: SmartlingProjectsApi;
    let projectsApiFetchStub;
    let projectsApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        projectsApi = new SmartlingProjectsApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);
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
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });

        it("Get projects by account", async () => {
            await projectsApi.listProjects("accountUid");

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                "https://test.com/accounts-api/v2/accounts/accountUid/projects",
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });

        it("Get projects by account with parameters", async () => {
            const parameters = new ListProjectsParameters()
                .setProjectNameFilter("test")
                .setIncludeArchived(true)
                .setLimit(10)
                .setOffset(0)
                .setProjectTypeCode("CONNECTED")
                .setProjectTypeCodes(["CONNECTED", "STANDALONE"]);

            await projectsApi.listProjects("accountUid", parameters);

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                "https://test.com/accounts-api/v2/accounts/accountUid/projects?projectNameFilter=test&includeArchived=true&limit=10&offset=0&projectTypeCode=CONNECTED&projectTypeCodes=CONNECTED&projectTypeCodes=STANDALONE",
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "get"
                }
            );
        });
    });
});
