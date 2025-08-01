import * as sinon from "sinon";
import * as assert from "assert";
import { loggerMock, authMock, responseMock } from "./mock";
import { SmartlingTagsApi } from "../api/tags/index";
import { SmartlingAuthApi } from "../api/auth/index";
import { ListAccountTagsParameters } from "../api/tags/params/list-account-tags-parameters";
import { ListProjectTagsParameters } from "../api/tags/params/list-project-tags-parameters";
import { SearchStringTagsParameters } from "../api/tags/params/search-string-tags-parameters";
import { AddTagsToStringsParameters } from "../api/tags/params/add-tags-to-strings-parameters";
import { RemoveTagsFromStringsParameters } from "../api/tags/params/remove-tags-from-strings-parameters";
import { RemoveAllTagsFromStringsParameters } from "../api/tags/params/remove-all-tags-from-strings-parameters";

describe("SmartlingTagsAPI class tests.", () => {
    const accountUid = "testAccountUid";
    const projectId = "testProjectId";
    let tagsApi;
    let tagsServiceApiFetchStub;
    let tagsServiceApiUaStub;
    let responseMockJsonStub;

    beforeEach(() => {
        tagsApi = new SmartlingTagsApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);
        tagsServiceApiFetchStub = sinon.stub(tagsApi, "fetch");
        tagsServiceApiUaStub = sinon.stub(tagsApi, "ua");
        responseMockJsonStub = sinon.stub(responseMock, "json");

        tagsServiceApiUaStub.returns("test_user_agent");
        tagsServiceApiFetchStub.returns(responseMock);
        responseMockJsonStub.returns({
            response: {}
        });
    });

    afterEach(() => {
        tagsServiceApiFetchStub.restore();
        responseMockJsonStub.restore();
        tagsServiceApiUaStub.restore();
    });

    describe("Methods", () => {
        it("List account tags", async () => {
            const params = new ListAccountTagsParameters()
                .setProjectIds(["project1", "project2"])
                .setTagMask("test")
                .setLimit(100)
                .setOffset(0);

            await tagsApi.listAccountTags(accountUid, params);

            sinon.assert.calledOnce(tagsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                tagsServiceApiFetchStub,
                `https://test.com/tags-api/v2/accounts/${accountUid}/tags`,
                {
                    body: "{\"projectIds\":[\"project1\",\"project2\"],\"tagMask\":\"test\",\"limit\":100,\"offset\":0}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("List account tags with minimal parameters", async () => {
            const params = new ListAccountTagsParameters()
                .setLimit(50);

            await tagsApi.listAccountTags(accountUid, params);

            sinon.assert.calledOnce(tagsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                tagsServiceApiFetchStub,
                `https://test.com/tags-api/v2/accounts/${accountUid}/tags`,
                {
                    body: "{\"limit\":50}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("List project tags", async () => {
            const params = new ListProjectTagsParameters()
                .setTagMask("frontend")
                .setLimit(50)
                .setOffset(10);

            await tagsApi.listProjectTags(projectId, params);

            sinon.assert.calledOnce(tagsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                tagsServiceApiFetchStub,
                `https://test.com/tags-api/v2/projects/${projectId}/tags?tagMask=frontend&limit=50&offset=10`,
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

        it("List project tags with no parameters", async () => {
            const params = new ListProjectTagsParameters();

            await tagsApi.listProjectTags(projectId, params);

            sinon.assert.calledOnce(tagsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                tagsServiceApiFetchStub,
                `https://test.com/tags-api/v2/projects/${projectId}/tags?`,
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

        it("Search string tags", async () => {
            const params = new SearchStringTagsParameters()
                .setStringHashcodes(["hash1", "hash2", "hash3"]);

            await tagsApi.searchStringTags(projectId, params);

            sinon.assert.calledOnce(tagsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                tagsServiceApiFetchStub,
                `https://test.com/tags-api/v2/projects/${projectId}/strings/tags/search`,
                {
                    body: "{\"stringHashcodes\":[\"hash1\",\"hash2\",\"hash3\"]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Add tags to strings", async () => {
            const params = new AddTagsToStringsParameters()
                .setTags(["urgent", "frontend", "ui"])
                .setStringHashcodes(["hash1", "hash2"]);

            await tagsApi.addTagsToStrings(projectId, params);

            sinon.assert.calledOnce(tagsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                tagsServiceApiFetchStub,
                `https://test.com/tags-api/v2/projects/${projectId}/strings/tags/add`,
                {
                    body: "{\"tags\":[\"urgent\",\"frontend\",\"ui\"],\"stringHashcodes\":[\"hash1\",\"hash2\"]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Remove tags from strings", async () => {
            const params = new RemoveTagsFromStringsParameters()
                .setTags(["urgent", "deprecated"])
                .setStringHashcodes(["hash1", "hash2", "hash3"]);

            await tagsApi.removeTagsFromStrings(projectId, params);

            sinon.assert.calledOnce(tagsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                tagsServiceApiFetchStub,
                `https://test.com/tags-api/v2/projects/${projectId}/strings/tags/remove`,
                {
                    body: "{\"tags\":[\"urgent\",\"deprecated\"],\"stringHashcodes\":[\"hash1\",\"hash2\",\"hash3\"]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });

        it("Remove all tags from strings", async () => {
            const params = new RemoveAllTagsFromStringsParameters()
                .setStringHashcodes(["hash1", "hash2", "hash3", "hash4"]);

            await tagsApi.removeAllTagsFromStrings(projectId, params);

            sinon.assert.calledOnce(tagsServiceApiFetchStub);
            sinon.assert.calledWithExactly(
                tagsServiceApiFetchStub,
                `https://test.com/tags-api/v2/projects/${projectId}/strings/tags/remove/all`,
                {
                    body: "{\"stringHashcodes\":[\"hash1\",\"hash2\",\"hash3\",\"hash4\"]}",
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post"
                }
            );
        });
    });

    describe("Parameter validation", () => {
        it("ListAccountTagsParameters should validate project IDs limit", () => {
            const params = new ListAccountTagsParameters();
            const tooManyProjects = Array(1001).fill("project");

            try {
                params.setProjectIds(tooManyProjects);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Project IDs array must not exceed 1000 items");
            }
        });

        it("ListAccountTagsParameters should validate limit range", () => {
            const params = new ListAccountTagsParameters();

            try {
                params.setLimit(0);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Limit must be between 1 and 1500");
            }

            try {
                params.setLimit(1501);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Limit must be between 1 and 1500");
            }
        });

        it("ListAccountTagsParameters should validate offset", () => {
            const params = new ListAccountTagsParameters();

            try {
                params.setOffset(-1);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Offset must be non-negative");
            }
        });

        it("ListProjectTagsParameters should validate limit range", () => {
            const params = new ListProjectTagsParameters();

            try {
                params.setLimit(-1);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Limit must be between 0 and 100");
            }

            try {
                params.setLimit(101);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Limit must be between 0 and 100");
            }
        });

        it("SearchStringTagsParameters should require string hashcodes", () => {
            const params = new SearchStringTagsParameters();

            try {
                params.setStringHashcodes([]);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "String hashcodes array is required");
            }

            try {
                params.setStringHashcodes(null as unknown as Array<string>);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "String hashcodes array is required");
            }
        });

        it("SearchStringTagsParameters should validate hashcodes limit", () => {
            const params = new SearchStringTagsParameters();
            const tooManyHashcodes = Array(1001).fill("hash");

            try {
                params.setStringHashcodes(tooManyHashcodes);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "String hashcodes array must not exceed 1000 items");
            }
        });

        it("AddTagsToStringsParameters should validate tags array", () => {
            const params = new AddTagsToStringsParameters();

            try {
                params.setTags([]);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Tags array is required");
            }

            try {
                params.setTags(null as unknown as Array<string>);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Tags array is required");
            }

            const tooManyTags = Array(101).fill("tag");
            try {
                params.setTags(tooManyTags);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Tags array must not exceed 100 items");
            }
        });

        it("AddTagsToStringsParameters should validate tag length", () => {
            const params = new AddTagsToStringsParameters();
            const longTag = "a".repeat(129);

            try {
                params.setTags([longTag]);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Tag length must not exceed 128 characters");
            }
        });

        it("AddTagsToStringsParameters should validate string hashcodes", () => {
            const params = new AddTagsToStringsParameters();

            try {
                params.setStringHashcodes([]);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "String hashcodes array is required");
            }

            const tooManyHashcodes = Array(1001).fill("hash");
            try {
                params.setStringHashcodes(tooManyHashcodes);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "String hashcodes array must not exceed 1000 items");
            }
        });

        it("RemoveTagsFromStringsParameters should validate tags and hashcodes", () => {
            const params = new RemoveTagsFromStringsParameters();

            try {
                params.setTags([]);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Tags array is required");
            }

            try {
                params.setStringHashcodes([]);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "String hashcodes array is required");
            }

            const longTag = "a".repeat(129);
            try {
                params.setTags([longTag]);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "Tag length must not exceed 128 characters");
            }
        });

        it("RemoveAllTagsFromStringsParameters should validate string hashcodes", () => {
            const params = new RemoveAllTagsFromStringsParameters();

            try {
                params.setStringHashcodes([]);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "String hashcodes array is required");
            }

            const tooManyHashcodes = Array(1001).fill("hash");
            try {
                params.setStringHashcodes(tooManyHashcodes);
                throw new Error("Exception is not thrown.");
            } catch (e) {
                assert.equal(e.constructor.name, "SmartlingException");
                assert.equal(e.message, "String hashcodes array must not exceed 1000 items");
            }
        });
    });

    describe("Edge cases", () => {
        it("Should handle maximum allowed project IDs", () => {
            const params = new ListAccountTagsParameters();
            const maxProjects = Array(1000).fill("project");

            // Should not throw
            params.setProjectIds(maxProjects);
            assert.deepStrictEqual(params.export().projectIds, maxProjects);
        });

        it("Should handle maximum allowed tags", () => {
            const params = new AddTagsToStringsParameters();
            const maxTags = Array(100).fill("tag");

            // Should not throw
            params.setTags(maxTags);
            assert.deepStrictEqual(params.export().tags, maxTags);
        });

        it("Should handle maximum allowed string hashcodes", () => {
            const params = new SearchStringTagsParameters();
            const maxHashcodes = Array(1000).fill("hash");

            // Should not throw
            params.setStringHashcodes(maxHashcodes);
            assert.deepStrictEqual(params.export().stringHashcodes, maxHashcodes);
        });

        it("Should handle maximum tag length", () => {
            const params = new AddTagsToStringsParameters();
            const maxLengthTag = "a".repeat(128);

            // Should not throw
            params.setTags([maxLengthTag]);
            assert.deepStrictEqual(params.export().tags, [maxLengthTag]);
        });
    });
});
