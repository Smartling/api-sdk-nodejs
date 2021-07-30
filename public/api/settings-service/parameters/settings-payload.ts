import BaseParameters from "../../parameters";

export class SettingsPayload extends BaseParameters {
    constructor(name: string) {
        super({name});
    }

    public setSettings(settings: object): SettingsPayload {
        this.set("settings", settings);

        return this;
    };

    public setSecrets(secrets: object): SettingsPayload {
        this.set("secrets", secrets);

        return this;
    };

    public setName(name: string): SettingsPayload {
        this.set("name", name);

        return this;
    };
}
