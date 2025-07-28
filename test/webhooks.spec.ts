import sinon from "sinon";
import assert from "assert";
import {
    SmartlingWebhooksApi,
    CreateSubscriptionParameters,
    UpdateSubscriptionParameters,
    UpdateSubscriptionSecretParameters,
    GetSubscriptionEventsParameters,
    SubscriptionEventAttemptStatus,
    SubscriptionEvent
} from "../api/webhooks";
import { SmartlingAuthApi } from "../api/auth";
import { SmartlingException } from "../api/exception";
import { loggerMock, authMock, responseMock } from "./mock";

describe("SmartlingWebhooksApi class tests.", () => {
    const accountUid = "testAccountUid";
    let webhooksApi: SmartlingWebhooksApi;
    let webhooksApiFetchStub;
    let webhooksApiUaStub;
    let responseMockTextStub;

    beforeEach(() => {
        webhooksApi = new SmartlingWebhooksApi("https://test.com", authMock as unknown as SmartlingAuthApi, loggerMock);

        webhooksApiFetchStub = sinon.stub(webhooksApi, "fetch");
        webhooksApiUaStub = sinon.stub(webhooksApi, "ua");
        responseMockTextStub = sinon.stub(responseMock, "text");

        webhooksApiUaStub.returns("test_user_agent");
        webhooksApiFetchStub.returns(responseMock);
        responseMockTextStub.returns("{\"response\": {}}");
    });

    afterEach(() => {
        webhooksApiFetchStub.restore();
        responseMockTextStub.restore();
        webhooksApiUaStub.restore();
    });

    it("gets all subscriptions", async () => {
        await webhooksApi.getSubscriptions(accountUid);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions`,
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

    it("gets a subscription", async () => {
        const subscriptionUid = "subscriptionUid";
        await webhooksApi.getSubscription(accountUid, subscriptionUid);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}`,
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

    it("gets available webhook event types", async () => {
        await webhooksApi.getAvailableEventTypes(accountUid);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/available-event-types`,
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

    describe("createSubscription", () => {
        it("creates a subscription", async () => {
            const event: SubscriptionEvent = {
                type: "project.created",
                schemaVersion: "1.0"
            };

            const params = new CreateSubscriptionParameters(
                "TestSub",
                "https://callback.url/hook",
                [event]
            )
                .setDescription("Webhook for new projects")
                .setRequestHeaders([{ headerName: "X-Auth", headerValue: "secret" }])
                .setProjectUids(["project-1", "project-2"])
                .setPayloadSecret("mySecret");

            await webhooksApi.createSubscription(accountUid, params);

            sinon.assert.calledOnce(webhooksApiFetchStub);
            sinon.assert.calledWithExactly(
                webhooksApiFetchStub,
                `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "post",
                    body: JSON.stringify({
                        subscriptionName: "TestSub",
                        subscriptionUrl: "https://callback.url/hook",
                        events: [{
                            type: "project.created",
                            schemaVersion: "1.0"
                        }],
                        description: "Webhook for new projects",
                        requestHeaders: [{ headerName: "X-Auth", headerValue: "secret" }],
                        projectUids: ["project-1", "project-2"],
                        payloadSecret: "mySecret"
                    })
                }
            );
        });

        it("throws if subscription name is missing", () => {
            assert.throws(() => {
                // eslint-disable-next-line no-new
                new CreateSubscriptionParameters("", "https://callback.url", [{
                    type: "project.created",
                    schemaVersion: "1.0"
                }]);
            }, SmartlingException);
        });

        it("throws if subscription url is missing", () => {
            assert.throws(() => {
                // eslint-disable-next-line no-new
                new CreateSubscriptionParameters("name", "", [{
                    type: "project.created",
                    schemaVersion: "1.0"
                }]);
            }, SmartlingException);
        });

        it("throws if events are empty", () => {
            assert.throws(() => {
                // eslint-disable-next-line no-new
                new CreateSubscriptionParameters("name", "https://callback.url", []);
            }, SmartlingException);
        });

        it("throws if too many events", () => {
            const events = new Array(1001).fill({
                type: "project.created",
                schemaVersion: "1.0"
            });

            assert.throws(() => {
                // eslint-disable-next-line no-new
                new CreateSubscriptionParameters("name", "https://callback.url", events);
            }, SmartlingException);
        });

        it("throws if too many headers", () => {
            const headers = Array.from({ length: 21 }, (_, i) => ({ headerName: `h${i}`, headerValue: `v${i}` }));
            const params = new CreateSubscriptionParameters("test", "https://callback", [{
                type: "project.created",
                schemaVersion: "1.0"
            }]);

            assert.throws(() => {
                params.setRequestHeaders(headers);
            }, SmartlingException);
        });

        it("throws if too many project uids", () => {
            const uids = Array.from({ length: 11 }, (_, i) => `project-${i}`);
            const params = new CreateSubscriptionParameters("test", "https://callback", [{
                type: "project.created",
                schemaVersion: "1.0"
            }]);

            assert.throws(() => {
                params.setProjectUids(uids);
            }, SmartlingException);
        });
    });

    describe("updateSubscription", () => {
        const subscriptionUid = "subscription-uid";

        it("updates a subscription", async () => {
            const event: SubscriptionEvent = {
                type: "project.created",
                schemaVersion: "1.0"
            };

            const params = new UpdateSubscriptionParameters(
                "UpdatedName",
                "https://callback.url/updated",
                [event],
                true
            )
                .setDescription("Updated description")
                .setRequestHeaders([{ headerName: "X-Token", headerValue: "abc" }])
                .setProjectUids(["project-1", "project-2"]);

            await webhooksApi.updateSubscription(accountUid, subscriptionUid, params);

            sinon.assert.calledOnce(webhooksApiFetchStub);
            sinon.assert.calledWithExactly(
                webhooksApiFetchStub,
                `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}`,
                {
                    headers: {
                        Authorization: "test_token_type test_access_token",
                        "Content-Type": "application/json",
                        "User-Agent": "test_user_agent"
                    },
                    method: "put",
                    body: JSON.stringify({
                        subscriptionName: "UpdatedName",
                        subscriptionUrl: "https://callback.url/updated",
                        events: [{
                            type: "project.created",
                            schemaVersion: "1.0"
                        }],
                        enabled: true,
                        description: "Updated description",
                        requestHeaders: [{ headerName: "X-Token", headerValue: "abc" }],
                        projectUids: ["project-1", "project-2"]
                    })
                }
            );
        });

        it("throws if subscription name is missing", () => {
            assert.throws(() => {
                // eslint-disable-next-line no-new
                new UpdateSubscriptionParameters("", "https://callback", [{
                    type: "project.created",
                    schemaVersion: "1.0"
                }], true);
            }, SmartlingException);
        });

        it("throws if subscription url is missing", () => {
            assert.throws(() => {
                // eslint-disable-next-line no-new
                new UpdateSubscriptionParameters("name", "", [{
                    type: "project.created",
                    schemaVersion: "1.0"
                }], true);
            }, SmartlingException);
        });

        it("throws if events are empty", () => {
            assert.throws(() => {
                // eslint-disable-next-line no-new
                new UpdateSubscriptionParameters("name", "https://callback", [], true);
            }, SmartlingException);
        });

        it("throws if too many events", () => {
            const events = new Array(1001).fill({
                type: "project.created",
                schemaVersion: "1.0"
            });

            assert.throws(() => {
                // eslint-disable-next-line no-new
                new UpdateSubscriptionParameters("name", "https://callback", events, true);
            }, SmartlingException);
        });

        it("throws if too many headers", () => {
            const headers = Array.from({ length: 21 }, (_, i) => ({ headerName: `h${i}`, headerValue: `v${i}` }));
            const params = new UpdateSubscriptionParameters("name", "https://callback", [{
                type: "project.created",
                schemaVersion: "1.0"
            }], true);

            assert.throws(() => {
                params.setRequestHeaders(headers);
            }, SmartlingException);
        });

        it("throws if too many project uids", () => {
            const uids = Array.from({ length: 11 }, (_, i) => `project-${i}`);
            const params = new UpdateSubscriptionParameters("name", "https://callback", [{
                type: "project.created",
                schemaVersion: "1.0"
            }], true);

            assert.throws(() => {
                params.setProjectUids(uids);
            }, SmartlingException);
        });
    });

    it("deletes a subscription", async () => {
        const subscriptionUid = "sub-123";

        await webhooksApi.deleteSubscription(accountUid, subscriptionUid);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}`,
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

    it("enables a subscription", async () => {
        const subscriptionUid = "sub-456";

        await webhooksApi.enableSubscription(accountUid, subscriptionUid);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}/enable`,
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

    it("disables a subscription", async () => {
        const subscriptionUid = "sub-789";

        await webhooksApi.disableSubscription(accountUid, subscriptionUid);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}/disable`,
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

    it("tests a subscription", async () => {
        const subscriptionUid = "sub-999";

        await webhooksApi.testSubscription(accountUid, subscriptionUid);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}/test`,
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

    it("gets subscription secret", async () => {
        const subscriptionUid = "sub-secret";

        await webhooksApi.getSubscriptionSecret(accountUid, subscriptionUid);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}/secret`,
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

    it("updates subscription secret", async () => {
        const subscriptionUid = "sub-secret-update";

        const params = new UpdateSubscriptionSecretParameters("newSecret");

        await webhooksApi.updateSubscriptionSecret(accountUid, subscriptionUid, params);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}/secret`,
            {
                headers: {
                    Authorization: "test_token_type test_access_token",
                    "Content-Type": "application/json",
                    "User-Agent": "test_user_agent"
                },
                method: "put",
                body: JSON.stringify({
                    payloadSecret: "newSecret"
                })
            }
        );
    });

    it("gets subscription statistics", async () => {
        const subscriptionUid = "sub-stats";

        await webhooksApi.getSubscriptionStatistics(accountUid, subscriptionUid);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}/statistics`,
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

    it("gets available event types", async () => {
        await webhooksApi.getAvailableEventTypes(accountUid);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/available-event-types`,
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

    describe("getSubscriptionEvents", () => {
        it("gets a subscription events when no parameters", async () => {
            const subscriptionUid = "subscriptionUid";
            await webhooksApi.getSubscriptionEvents(accountUid, subscriptionUid);

            sinon.assert.calledOnce(webhooksApiFetchStub);
            sinon.assert.calledWithExactly(
                webhooksApiFetchStub,
                `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}/events`,
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

        it("gets a subscription events when empty parameters", async () => {
            const subscriptionUid = "subscriptionUid";
            await webhooksApi.getSubscriptionEvents(
                accountUid, subscriptionUid, new GetSubscriptionEventsParameters());

            sinon.assert.calledOnce(webhooksApiFetchStub);
            sinon.assert.calledWithExactly(
                webhooksApiFetchStub,
                `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}/events?`,
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

        it("gets a subscription events when parameter specified", async () => {
            const subscriptionUid = "subscriptionUid";
            const date = new Date();
            const dateString = encodeURIComponent(`${date.toISOString().split(".")[0]}Z`);
            const params = new GetSubscriptionEventsParameters()
                .setLimit(10)
                .setScrollId("scrollId123")
                .setAttemptStatus(SubscriptionEventAttemptStatus.SUCCESS)
                .setCreatedDateBefore(date)
                .setCreatedDateAfter(date)
                .setEventTypes(["event1", "event2"]);
            await webhooksApi.getSubscriptionEvents(accountUid, subscriptionUid, params);

            sinon.assert.calledOnce(webhooksApiFetchStub);
            sinon.assert.calledWithExactly(
                webhooksApiFetchStub,
                `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}/events?limit=10&scrollId=scrollId123&attemptStatus=SUCCESS&createdDateBefore=${dateString}&createdDateAfter=${dateString}&eventTypes=event1&eventTypes=event2`,
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

    it("gets a subscription event", async () => {
        const subscriptionUid = "subscriptionUid";
        const eventId = "eventId";
        await webhooksApi.getSubscriptionEvent(accountUid, subscriptionUid, eventId);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}/events/${eventId}`,
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

    it("gets a subscription event attempts", async () => {
        const subscriptionUid = "subscriptionUid";
        const eventId = "eventId";
        await webhooksApi.getSubscriptionEventAttempts(accountUid, subscriptionUid, eventId);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}/events/${eventId}/attempts`,
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

    it("sends a subscription", async () => {
        const subscriptionUid = "sub-999";
        const eventId = "event-123";

        await webhooksApi.sendSubscriptionEvent(accountUid, subscriptionUid, eventId);

        sinon.assert.calledOnce(webhooksApiFetchStub);
        sinon.assert.calledWithExactly(
            webhooksApiFetchStub,
            `https://test.com/webhooks-api/v2/accounts/${accountUid}/subscriptions/${subscriptionUid}/events/${eventId}/send`,
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
});
