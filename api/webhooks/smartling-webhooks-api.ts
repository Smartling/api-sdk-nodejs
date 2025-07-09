import { SmartlingBaseApi } from "../base";
import { SmartlingAuthApi } from "../auth";
import { Logger } from "../logger";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { SubscriptionDto } from "./dto/subscription-dto";
import { SubscriptionSecretDto } from "./dto/subscription-secret-dto";
import { SubscriptionStatisticsDto } from "./dto/subscription-statistics-dto";
import { WebhookEventTypeDto } from "./dto/webhook-event-type.dto";
import { CreateSubscriptionParameters } from "./params/create-subscription-parameters";
import { UpdateSubscriptionParameters } from "./params/update-subscription-parameters";
import { UpdateSubscriptionSecretParameters } from "./params/update-subscription-secret-parameters";

export class SmartlingWebhooksApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: SmartlingAuthApi, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/webhooks-api/v2`;
    }

    getSubscriptions(
        accountUid: string
    ): Promise<SmartlingListResponse<SubscriptionDto>> {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/subscriptions`
        );
    }

    getSubscription(
        accountUid: string,
        subscriptionUid: string
    ): Promise<SubscriptionDto> {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/subscriptions/${subscriptionUid}`
        );
    }

    createSubscription(
        accountUid: string,
        params: CreateSubscriptionParameters
    ): Promise<SubscriptionDto> {
        return this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/subscriptions`,
            JSON.stringify(params.export())
        );
    }

    updateSubscription(
        accountUid: string,
        subscriptionUid: string,
        params: UpdateSubscriptionParameters
    ): Promise<SubscriptionDto> {
        return this.makeRequest(
            "put",
            `${this.entrypoint}/accounts/${accountUid}/subscriptions/${subscriptionUid}`,
            JSON.stringify(params.export())
        );
    }

    deleteSubscription(
        accountUid: string,
        subscriptionUid: string
    ): Promise<void> {
        return this.makeRequest(
            "delete",
            `${this.entrypoint}/accounts/${accountUid}/subscriptions/${subscriptionUid}`
        );
    }

    enableSubscription(
        accountUid: string,
        subscriptionUid: string
    ): Promise<void> {
        return this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/subscriptions/${subscriptionUid}/enable`
        );
    }

    disableSubscription(
        accountUid: string,
        subscriptionUid: string
    ): Promise<void> {
        return this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/subscriptions/${subscriptionUid}/disable`
        );
    }

    testSubscription(
        accountUid: string,
        subscriptionUid: string
    ): Promise<void> {
        return this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/subscriptions/${subscriptionUid}/test`
        );
    }

    getSubscriptionSecret(
        accountUid: string,
        subscriptionUid: string
    ): Promise<SubscriptionSecretDto> {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/subscriptions/${subscriptionUid}/secret`
        );
    }

    updateSubscriptionSecret(
        accountUid: string,
        subscriptionUid: string,
        params: UpdateSubscriptionSecretParameters
    ): Promise<SubscriptionSecretDto> {
        return this.makeRequest(
            "put",
            `${this.entrypoint}/accounts/${accountUid}/subscriptions/${subscriptionUid}/secret`,
            JSON.stringify(params.export())
        );
    }

    getSubscriptionStatistics(
        accountUid: string,
        subscriptionUid: string
    ): Promise<SubscriptionStatisticsDto> {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/subscriptions/${subscriptionUid}/statistics`
        );
    }

    // getSubscriptionEvents() {}

    // getSubscriptionEvent() {}

    // sendSubscriptionEvent() {}

    // getSubscriptionEventAttempts() {}

    getAvailableEventTypes(accountUid: string): Promise<WebhookEventTypeDto> {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/available-event-types`
        );
    }
}
