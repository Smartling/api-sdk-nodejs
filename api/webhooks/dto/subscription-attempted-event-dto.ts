import { SubscriptionEventAttemptStatus } from "./subscription-event-attempt-status";

interface SubscriptionAttemptedEventDto {
    eventId: string;
    eventType: string;
    createdDate: Date;
    lastAttemptStatus: SubscriptionEventAttemptStatus
}

export { SubscriptionAttemptedEventDto };
