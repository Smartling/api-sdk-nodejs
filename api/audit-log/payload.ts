class Payload {
    actionTime: Date;
    actionType: string;
    fileUri: string;
    fileUid: string;
    translationJobUid: string;
    translationJobName: string;
    translationJobDueDate: Date;
    translationJobAuthorize: boolean;
    batchUid: string;
    sourceLocaleId: string;
    targetLocaleId: string;
    targetLocaleIds: Array<string>;
    description: string;
    envId: string;
    clientUserId: string;
    clientUserEmail: string;
    clientUserName: string;
    clientData: object;

    constructor(actionTime: Date, actionType: string) {
        this.actionTime = actionTime;
        this.actionType = actionType;
    }

    stringify(): string {
        const object = JSON.parse(JSON.stringify(this));
        object.actionTime = Payload.stripMilliseconds(object.actionTime);
        if (object.translationJobDueDate) {
            object.translationJobDueDate = Payload.stripMilliseconds(object.translationJobDueDate);
        }
        return JSON.stringify(object);
    }

    private static stripMilliseconds(isoString: string): string {
        return isoString.split('.')[0] + "Z";
    }
}

export default Payload;
