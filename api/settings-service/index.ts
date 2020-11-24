import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import { SettingsPayload } from "./parameters/settings-payload";
import { SettingsDto } from "./dto/settings-dto";

export class SmartlingSettingsServiceApi extends SmartlingBaseApi {
    private readonly authApi: SmartlingAuthApi;
    private readonly entrypoint: string;
    public secretsDecryptor: Decryptor;
    public secretsEncryptor: Encryptor;

    constructor(authApi, logger, smartlingApiBaseUrl: string, secretsEncryptor: Encryptor = new NoOpEncryptor(), secretsDecryptor: Decryptor = new NoOpDecryptor()) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/connectors-settings-api/v2`;
        if (Array.isArray(secretsEncryptor)) {
            this.secretsDecryptor = secretsEncryptor[1];
            this.secretsEncryptor = secretsEncryptor[0];
        } else {
            this.secretsDecryptor = secretsDecryptor;
            this.secretsEncryptor = secretsEncryptor;
        }
        this.checkDecryptAfterEncrypt();
    }

    public async createProjectLevelSettings<TSecrets, TSettings>(projectUid: string, integrationId: string, payload: SettingsPayload): Promise<SettingsDto<TSecrets, TSettings>> {
        return this.mapItemToDto<TSecrets, TSettings>(await this.makeRequest(
            "post",
            this.getProjectLevelApiUrl(projectUid, integrationId),
            JSON.stringify(payload.export()),
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

    public async updateProjectLevelSettings<TSecrets, TSettings>(projectUid: string, integrationId: string, payload: SettingsPayload): Promise<SettingsDto<TSecrets, TSettings>> {
        return this.mapItemToDto<TSecrets, TSettings>(await this.makeRequest(
            "put",
            this.getProjectLevelApiUrl(projectUid, integrationId),
            JSON.stringify(payload.export()),
        ));
    }

    private getProjectLevelApiUrl(project: string, integration: string): string {
        return `${this.entrypoint}/projects/${project}/integrations/${integration}/settings`;
    }

    private mapItemToDto<TSecrets, TSettings>(settings: object): SettingsDto<TSecrets, TSettings> {
        ["created", "modified"].forEach(function (field) {
            if (settings[field]) {
                settings[field] = new Date(settings[field]);
            }
        });

        return settings as SettingsDto<TSecrets, TSettings>;
    }

    private checkDecryptAfterEncrypt() {
        const string = randomBytes(32).toString('hex');
        const encrypted = this.secretsEncryptor.encrypt(string, this.secretsEncryptor.testPassword);
        const decrypted = this.secretsDecryptor.decrypt(encrypted, this.secretsEncryptor.testPassword);
        if (string !== decrypted) {
            throw new Error('Strings differ after a single encrypt-decrypt pass, check your encryptor and decryptor settings');
        }
    }
}
