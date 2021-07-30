export interface SettingsDto<TSecrets, TSettings> {
    settingsUid: string;
    accountUid: string;
    projectId: string;
    integrationId: string;
    name: string;
    secrets: TSecrets;
    settings: TSettings;
    created: Date;
    modified: Date;
}
