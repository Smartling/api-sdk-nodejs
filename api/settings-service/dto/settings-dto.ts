export interface SettingsDto {
    settingsUid: string;
    accountUid: string;
    projectId: string;
    integrationId: string;
    name: string;
    secrets: object;
    settings: object;
    created: Date;
    modified: Date;
}
