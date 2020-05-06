import { SmartlingApiFactory } from "../api/factory";
import { SmartlingSettingsServiceApi } from "../api/settings-service";
import { SettingsPayload } from "../api/settings-service/parameters/settings-payload";

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

const baseUrl = "https://api.smartling.com";
const integrationId = "example";
const apiFactory = new SmartlingApiFactory(userId, userSecret, baseUrl, logger);
const smartlingSettingsServiceApi = apiFactory.createApiClient(SmartlingSettingsServiceApi, { timeout: 10000 });

const payload: SettingsPayload = (new SettingsPayload("test"))
    .setSecrets({"secret": "secretValue"})
    .setSettings({"setting": "value"});

(async () => {
    try {
        const settings = await smartlingSettingsServiceApi.createProjectLevelSettings(projectId, integrationId, payload);
        if (settings) {
            const uid = settings.settingsUid;

            logger.info(`Settings uid: ${uid} created on ${settings.created.toISOString()}`);

            await smartlingSettingsServiceApi.updateProjectLevelSettings(
                projectId,
                integrationId,
                uid,
                new SettingsPayload("empty settings")
            );

            const updated = await smartlingSettingsServiceApi.getProjectLevelSettings(projectId, integrationId, uid);

            logger.info(`Settings uid: ${uid} has name ${updated.name}`);

            try {
                if (await smartlingSettingsServiceApi.deleteProjectLevelSettings(projectId, integrationId, settings.settingsUid)) {
                    logger.info("Deleted settings");
                }
            } catch (e) {
                logger.info("Only administrators can delete settings");
            }
        }
    } catch (e) {
        console.warn(e);
    }
})();
