import assert from "assert";
import sinon from "sinon";
import { SmartlingProjectsApi } from "../api/projects/index";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingAuthApi } from "../api/auth/index";
import { ListProjectsParameters } from "../api/projects/params/list-projects-parameters";
import { CreateProjectParameters } from "../api/projects/params/create-project-parameters";
import { RenameProjectParameters } from "../api/projects/params/rename-project-parameters";
import { UpdateProjectDescriptionParameters } from "../api/projects/params/update-project-description-parameters";
import { CreateTargetLocaleParameters } from "../api/projects/params/create-target-locale-parameters";

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
                .setProjectTypeCodes(["CONNECTED", "STANDALONE"])
                .setProjectUids(["project1", "project2"]);

            await projectsApi.listProjects("accountUid", parameters);

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                "https://test.com/accounts-api/v2/accounts/accountUid/projects?projectNameFilter=test&includeArchived=true&limit=10&offset=0&projectTypeCode=CONNECTED&projectTypeCodes=CONNECTED&projectTypeCodes=STANDALONE&projectUids=project1&projectUids=project2",
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

        it("Throws when projectUids exceeds the max count", () => {
            const tooManyProjectUids = Array.from({ length: 101 }, (_, i) => `project${i}`);

            assert.throws(() => {
                new ListProjectsParameters().setProjectUids(tooManyProjectUids);
            }, /projectUids must contain at most 100 items/);
        });

        it("Get project details with includeDisabledLocales", async () => {
            await projectsApi.getProjectDetails(projectId, true);

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                `https://test.com/projects-api/v2/projects/${projectId}?includeDisabledLocales=true`,
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

        it("Create project", async () => {
            const parameters = new CreateProjectParameters()
                .setProjectName("Test project")
                .setProjectTypeCode("CONNECTED")
                .setOriginalLocaleId("en-US")
                .setTranslationLocaleIds(["fr-FR", "de-DE"])
                .setSiteUrl("https://example.com")
                .setPackageUid("packageUid")
                .setLqaDefaultWorkflowUid("lqaWorkflowUid")
                .setLqaNewWorkflowName("LQA workflow")
                .setLqaSchemaUid("lqaSchemaUid")
                .setDefaultWorkflowUid("defaultWorkflowUid");

            await projectsApi.createProject("accountUid", parameters);

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                "https://test.com/accounts-api/v2/accounts/accountUid/projects",
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    body: JSON.stringify({
                        projectName: "Test project",
                        projectTypeCode: "CONNECTED",
                        originalLocaleId: "en-US",
                        translationLocaleIds: ["fr-FR", "de-DE"],
                        siteURL: "https://example.com",
                        packageUid: "packageUid",
                        lqaDefaultWorkflowUid: "lqaWorkflowUid",
                        lqaNewWorkflowName: "LQA workflow",
                        lqaSchemaUid: "lqaSchemaUid",
                        defaultWorkflowUid: "defaultWorkflowUid"
                    })
                }
            );
        });

        it("Archive project", async () => {
            await projectsApi.archiveProject(projectId);

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                `https://test.com/projects-api/v2/projects/${projectId}/archive`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Unarchive project", async () => {
            await projectsApi.unarchiveProject(projectId);

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                `https://test.com/projects-api/v2/projects/${projectId}/unarchive`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Rename project", async () => {
            const parameters = new RenameProjectParameters().setProjectName("New name");

            await projectsApi.renameProject(projectId, parameters);

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                `https://test.com/projects-api/v2/projects/${projectId}/rename`,
                {
                    method: "put",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    body: JSON.stringify({ projectName: "New name" })
                }
            );
        });

        it("Update project description", async () => {
            const parameters = new UpdateProjectDescriptionParameters().setDescription("New description");

            await projectsApi.updateProjectDescription(projectId, parameters);

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                `https://test.com/projects-api/v2/projects/${projectId}/description`,
                {
                    method: "put",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    body: JSON.stringify({ description: "New description" })
                }
            );
        });

        it("Throws when description exceeds the max length", () => {
            const tooLongDescription = "a".repeat(251);

            assert.throws(() => {
                new UpdateProjectDescriptionParameters().setDescription(tooLongDescription);
            }, /Project description should be less than 250 characters\./);
        });

        it("Create target locale", async () => {
            const parameters = new CreateTargetLocaleParameters()
                .setLocaleId("fr-FR")
                .setDefaultWorkflowUid("defaultWorkflowUid");

            await projectsApi.createTargetLocale(projectId, parameters);

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                `https://test.com/projects-api/v2/projects/${projectId}/targetLocales`,
                {
                    method: "post",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    body: JSON.stringify({ localeId: "fr-FR", defaultWorkflowUid: "defaultWorkflowUid" })
                }
            );
        });

        it("Delete target locale", async () => {
            await projectsApi.deleteTargetLocale(projectId, "fr-FR");

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                `https://test.com/projects-api/v2/projects/${projectId}/locales/fr-FR`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "delete"
                }
            );
        });

        it("Get target locales", async () => {
            await projectsApi.getTargetLocales(projectId);

            sinon.assert.calledOnce(projectsApiFetchStub);
            sinon.assert.calledWithExactly(
                projectsApiFetchStub,
                `https://test.com/projects-api/v2/projects/${projectId}/targetLocales`,
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
