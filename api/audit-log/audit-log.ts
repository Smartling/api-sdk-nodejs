class AuditLog {
    actionTime: Date;
    actionType: string;
    fileUri?: string;
    fileUid?: string;
    translationJobUid?: string;
    translationJobName?: string;
    translationJobDueDate?: Date;
    translationJobAuthorize?: boolean;
    batchUid?: string;
    sourceLocaleId?: string;
    targetLocaleId?: string;
    targetLocaleIds?: Array<string>;
    description?: string;
    envId?: string;
    clientUserId?: string;
    clientUserEmail?: string;
    clientUserName?: string;
    clientData?: object;

    constructor(actionTime: Date, actionType: string) {
        this.actionTime = actionTime;
        this.actionType = actionType;
    }

    public toJSON(): object {
        return {
            actionTime: AuditLog.stripMilliseconds(this.actionTime),
            actionType: this.actionType,
            fileUri: this.fileUid,
            fileUid: this.fileUid,
            translationJobUid: this.translationJobUid,
            translationJobName: this.translationJobName,
            translationJobDueDate: this.translationJobDueDate ? AuditLog.stripMilliseconds(this.translationJobDueDate) : null,
            translationJobAuthorize: this.translationJobAuthorize,
            batchUid: this.batchUid,
            sourceLocaleId: this.sourceLocaleId,
            targetLocaleId: this.targetLocaleId,
            targetLocaleIds: this.targetLocaleIds,
            description: this.description,
            envId: this.envId,
            clientUserId: this.clientUserId,
            clientUserEmail: this.clientUserEmail,
            clientUserName: this.clientUserName,
            clientData: this.clientData
        };
    }

    private static stripMilliseconds(date: Date): string {
        return date.toISOString().split('.')[0] + "Z";
    }
}

export default AuditLog;
