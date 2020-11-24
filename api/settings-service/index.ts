import Codec from "./encode/codec";
import EncodedSecrets from "./encode/encoded-secrets";
import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import { SettingsDto } from "./dto/settings-dto";
import { SettingsPayload } from "./parameters/settings-payload";
import { randomBytes } from "crypto";

export class SmartlingSettingsServiceApi extends SmartlingBaseApi {
    private readonly authApi: SmartlingAuthApi;
    private readonly entrypoint: string;
    private secretsCodec: Codec | null = null;

    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/connectors-settings-api/v2`;
    }

    public async createProjectLevelSettings<TSecrets, TSettings>(projectUid: string, integrationId: string, payload: SettingsPayload): Promise<SettingsDto<TSecrets, TSettings>> {
        return this.mapItemToDto<TSecrets, TSettings>(await this.makeRequest(
            "post",
            this.getProjectLevelApiUrl(projectUid, integrationId),
            JSON.stringify(this.encodeSecrets(payload).export()),
        ));
    }

    public async deleteProjectLevelSettings(projectUid: string, integrationId: string): Promise<boolean> {
        return await this.makeRequest("delete", this.getProjectLevelApiUrl(projectUid, integrationId));
    }

    public async getProjectLevelSettings<TSecrets, TSettings>(projectUid: string, integrationId: string): Promise<SettingsDto<TSecrets, TSettings>> {
        return this.mapItemToDto<TSecrets, TSettings>(
            await this.makeRequest("get", this.getProjectLevelApiUrl(projectUid, integrationId))
        );
    }

    public setSecretsCodec(codec: Codec) {
        this.secretsCodec = codec;
        this.assertDecryptAfterEncryptSuccess();
    }

    public async updateProjectLevelSettings<TSecrets, TSettings>(projectUid: string, integrationId: string, payload: SettingsPayload): Promise<SettingsDto<TSecrets, TSettings>> {
        return this.mapItemToDto<TSecrets, TSettings>(await this.makeRequest(
            "put",
            this.getProjectLevelApiUrl(projectUid, integrationId),
            JSON.stringify(this.encodeSecrets(payload).export()),
        ));
    }

    private getProjectLevelApiUrl(project: string, integration: string): string {
        return `${this.entrypoint}/projects/${project}/integrations/${integration}/settings`;
    }

    private mapItemToDto<TSecrets, TSettings>(settings: any): SettingsDto<TSecrets, TSettings> {
        ["created", "modified"].forEach(function (field) {
            if (settings[field]) {
                settings[field] = new Date(settings[field]);
            }
        });
        if (this.secretsCodec !== null && settings.hasOwnProperty('secrets') && SmartlingSettingsServiceApi.isEncodedSecrets(settings.secrets)) {
            settings.secrets = this.secretsCodec.decode(settings.secrets);
        }

        return settings as SettingsDto<TSecrets, TSettings>;
    }

    private assertDecryptAfterEncryptSuccess() {
        const string = randomBytes(32).toString('hex');
        const encrypted = this.secretsCodec.encode(string);
        const decrypted = this.secretsCodec.decode(encrypted);
        if (string !== decrypted) {
            throw new Error('Strings differ after an encrypt-decrypt pass, check your codec settings');
        }
    }

    private encodeSecrets(payload: SettingsPayload): SettingsPayload {
        if (this.secretsCodec === null || typeof payload.export().secrets === 'undefined') {
            return payload;
        }

        return payload.setSecrets(this.secretsCodec.encode(payload.export().secrets));
    }

    private static isEncodedSecrets(object: any): object is EncodedSecrets {
        return object !== null && typeof object === 'object' && object.hasOwnProperty('encodedWith') && object.hasOwnProperty('value') && typeof object.encodedWith === 'string' && typeof object.value === 'string';
    }
}
