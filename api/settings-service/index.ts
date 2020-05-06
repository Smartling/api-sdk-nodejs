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
        return this.mapItemToDto(await this.makeRequest(
            "post",
            this.getProjectLevelApiUrl(projectUid, integrationId),
            JSON.stringify(payload.export()),
        ));
    }

    public async deleteProjectLevelSettings(projectUid: string, integrationId: string, settingsUid: string): Promise<boolean> {
        return await this.makeRequest("delete", this.getProjectLevelApiUrl(projectUid, integrationId, settingsUid));
    }

    public async getProjectLevelSettings(projectUid: string, integrationId: string, settingsUid: string): Promise<SettingsDto> {
        return this.mapItemToDto(
            await this.makeRequest("get", this.getProjectLevelApiUrl(projectUid, integrationId, settingsUid))
        );
    }

    public async updateProjectLevelSettings(projectUid: string, integrationId: string, settingsUid: string, payload: SettingsPayload): Promise<SettingsDto> {
        return this.mapItemToDto(await this.makeRequest(
            "put",
            this.getProjectLevelApiUrl(projectUid, integrationId, settingsUid),
            JSON.stringify(payload.export()),
        ));
    }

    private getProjectLevelApiUrl(project: string, integration: string, settingsUid?: string): string {
        let path = `${this.entrypoint}/projects/${project}/integrations/${integration}/settings`;
        if (settingsUid) {
            path += `/${settingsUid}`;
        }

        return path;
    }

    private mapItemToDto(settings: object): SettingsDto {
        ["created", "modified"].forEach(function (field) {
            if (settings[field]) {
                settings[field] = new Date(settings[field]);
            }
        })

        return settings as SettingsDto;
    }
}
