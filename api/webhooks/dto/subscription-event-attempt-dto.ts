import { SubscriptionEventAttemptStatus } from "./subscription-event-attempt-status";
import { SubscriptionEventTriggerType } from "./subscription-event-trigger-type";

interface SubscriptionEventAttemptDto {
    attemptId: string;
    eventId: string;
    response: string | null;
    responseDurationMs: number;
    responseStatusCode: number;
    attemptStatus: SubscriptionEventAttemptStatus;
    attemptDate: Date;
    url: string;
    triggerType: SubscriptionEventTriggerType;
}

export { SubscriptionEventAttemptDto };
