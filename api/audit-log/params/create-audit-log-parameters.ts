import BaseParameters from "../../parameters";
import AuditLogDto from "../dto/audit-log-dto";

class CreateAuditLogParameters extends BaseParameters {
    public setActionTime(actionTime: Date): CreateAuditLogParameters {
        this.set("actionTime", CreateAuditLogParameters.stripMilliseconds(actionTime));

        return this;
    };

    public setActionType(actionType: string): CreateAuditLogParameters {
        this.set("actionType", actionType);

        return this;
    };

    public setFileUri(fileUri: string): CreateAuditLogParameters {
        this.set("fileUri", fileUri);

        return this;
    };

    public setFileUid(fileUid: string): CreateAuditLogParameters {
        this.set("fileUid", fileUid);

        return this;
    };

    public setTranslationJobUid(translationJobUid: string): CreateAuditLogParameters {
        this.set("translationJobUid", translationJobUid);

        return this;
    };

    public setTranslationJobName(translationJobName: string): CreateAuditLogParameters {
        this.set("translationJobName", translationJobName);

        return this;
    };

    public setTranslationJobDueDate(translationJobDueDate: Date): CreateAuditLogParameters {
        this.set("translationJobDueDate", CreateAuditLogParameters.stripMilliseconds(translationJobDueDate));

        return this;
    };

    public setTranslationJobAuthorize(translationJobAuthorize: boolean): CreateAuditLogParameters {
        this.set("translationJobAuthorize",translationJobAuthorize);

        return this;
    };

    public setBatchUid(batchUid: string): CreateAuditLogParameters {
        this.set("batchUid", batchUid);

        return this;
    };

    public setSourceLocaleId(sourceLocaleId: string): CreateAuditLogParameters {
        this.set("sourceLocaleId", sourceLocaleId);

        return this;
    };

    public setTargetLocaleId(targetLocaleId: string): CreateAuditLogParameters {
        this.set("targetLocaleId", targetLocaleId);

        return this;
    };

    public setTargetLocaleIds(targetLocaleIds: Array<string>): CreateAuditLogParameters {
        this.set("targetLocaleIds", targetLocaleIds);

        return this;
    };

    public setDescription(description: string): CreateAuditLogParameters {
        this.set("description", description);

        return this;
    };

    public setEnvId(envId: string): CreateAuditLogParameters {
        this.set("envId", envId);

        return this;
    };

    public setClientUserId(clientUserId: string): CreateAuditLogParameters {
        this.set("clientUserId", clientUserId);

        return this;
    };

    public setClientUserEmail(clientUserEmail: string): CreateAuditLogParameters {
        this.set("clientUserEmail", clientUserEmail);

        return this;
    };

    public setClientUserName(clientUserName: string): CreateAuditLogParameters {
        this.set("clientUserName", clientUserName);

        return this;
    };

    public setClientData(clientData: object): CreateAuditLogParameters {
        this.set("clientData", clientData);

        return this;
    };

    private static stripMilliseconds(date: Date): string {
        return date.toISOString().split('.')[0] + "Z";
    }

    public static fromDto(auditLogDto: AuditLogDto): CreateAuditLogParameters {
        const params = new CreateAuditLogParameters();

        if (auditLogDto.actionTime) {
            params.setActionTime(auditLogDto.actionTime);
        }

        if (auditLogDto.actionType) {
            params.setActionType(auditLogDto.actionType);
        }

        if (auditLogDto.batchUid) {
            params.setBatchUid(auditLogDto.batchUid);
        }

        if (auditLogDto.clientData) {
            params.setClientData(auditLogDto.clientData);
        }

        if (auditLogDto.clientUserEmail) {
            params.setClientUserEmail(auditLogDto.clientUserEmail);
        }

        if (auditLogDto.clientUserId) {
            params.setClientUserId(auditLogDto.clientUserId);
        }

        if (auditLogDto.clientUserName) {
            params.setClientUserName(auditLogDto.clientUserName);
        }

        if (auditLogDto.description) {
            params.setDescription(auditLogDto.description);
        }

        if (auditLogDto.envId) {
            params.setEnvId(auditLogDto.envId);
        }

        if (auditLogDto.fileUid) {
            params.setFileUid(auditLogDto.fileUid);
        }

        if (auditLogDto.fileUri) {
            params.setFileUri(auditLogDto.fileUri);
        }

        if (auditLogDto.sourceLocaleId) {
            params.setSourceLocaleId(auditLogDto.sourceLocaleId);
        }

        if (auditLogDto.targetLocaleId) {
            params.setTargetLocaleId(auditLogDto.targetLocaleId);
        }

        if (auditLogDto.targetLocaleIds) {
            params.setTargetLocaleIds(auditLogDto.targetLocaleIds);
        }

        if (auditLogDto.translationJobAuthorize) {
            params.setTranslationJobAuthorize(auditLogDto.translationJobAuthorize);
        }

        if (auditLogDto.translationJobDueDate) {
            params.setTranslationJobDueDate(auditLogDto.translationJobDueDate);
        }

        if (auditLogDto.translationJobName) {
            params.setTranslationJobName(auditLogDto.translationJobName);
        }

        if (auditLogDto.translationJobUid) {
            params.setTranslationJobUid(auditLogDto.translationJobUid);
        }

        return params;
    }
}

export default CreateAuditLogParameters;
