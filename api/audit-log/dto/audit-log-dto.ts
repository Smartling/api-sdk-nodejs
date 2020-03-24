interface AuditLogDto {
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
}

export default AuditLogDto;
