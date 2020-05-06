import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import { SettingsPayload } from "./parameters/settings-payload";
import { SettingsDto } from "./dto/settings-dto";

export class SmartlingSettingsServiceApi extends SmartlingBaseApi {
    private readonly authApi: SmartlingAuthApi;
    private readonly entrypoint: string;

    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/connectors-settings-service-api/v2`;
    }

    public async createProjectLevelSettings(projectUid: string, integrationId: string, payload: SettingsPayload): Promise<SettingsDto> {
        try {
            return this.convertDates(await this.makeRequest(
                "post",
                this.getProjectPath(projectUid, integrationId),
                JSON.stringify(payload.export()),
            ));
        } catch (e) {
            try {
                const errorPayload = JSON.parse(JSON.parse(e.payload));
                if (errorPayload) {
                    console.log(errorPayload.response.errors[0].message);
                }
            } catch (parseError) {
                console.warn(e);
            }
        }
    }

    public async deleteProjectLevelSettings(projectUid: string, integrationId: string, settingsUid: string): Promise<boolean> {
        try {
            await this.makeRequest("delete", this.getProjectPath(projectUid, integrationId, settingsUid));
            return true;
        } catch (e) {
            try {
                const errorPayload = JSON.parse(JSON.parse(e.payload));
                if (errorPayload) {
                    if (errorPayload.response.errors[0].message === "Forbidden") {
                        console.warn(`Unable to delete settings ${settingsUid}. Only administrators can delete settings.`);
                    }
                }
            } catch (parseError) {
                console.warn(e);
            }
        }
        return false;
    }

    public async getProjectLevelSettings(projectUid: string, integrationId: string, settingsUid: string): Promise<SettingsDto> {
        try {
            return this.makeRequest("get", this.getProjectPath(projectUid, integrationId, settingsUid));
        } catch (e) {
            console.warn(e);
        }
    }

    public async updateProjectLevelSettings(projectUid: string, integrationId: string, settingsUid: string, payload: SettingsPayload): Promise<SettingsDto> {
        try {
            return this.convertDates(await this.makeRequest(
                "put",
                this.getProjectPath(projectUid, integrationId, settingsUid),
                JSON.stringify(payload.export()),
            ));
        } catch (e) {
            console.warn(e);
        }
    }

    private getProjectPath(project: string, integration: string, settingsUid?: string): string {
        let path = `${this.entrypoint}/projects/${project}/integrations/${integration}/settings`;
        if (settingsUid) {
            path += `/${settingsUid}`;
        }
        
        return path;
    }
    
    private async convertDates(settings: SettingsDto): Promise<SettingsDto> {
        ["created", "modified"].forEach(function (field) {
            if (settings[field]) {
                settings[field] = new Date(settings[field]);
            }
        })

        return settings;
    }
}
