interface SubscriptionEventDto {
    eventId: string;
    eventType: string;
    createdDate: Date;
    payload: Record<string, unknown>;
}

export { SubscriptionEventDto };
