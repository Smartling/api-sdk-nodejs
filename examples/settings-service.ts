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
            logger.info(`Settings for projectId=${projectId} and integrationId=${integrationId} created on ${settings.created.toISOString()}`);

            await smartlingSettingsServiceApi.updateProjectLevelSettings(
                projectId,
                integrationId,
                new SettingsPayload("empty settings")
            );

            const updated = await smartlingSettingsServiceApi.getProjectLevelSettings(projectId, integrationId);

            logger.info(`Settings for projectId=${projectId} and integrationId=${integrationId} has name ${updated.name}`);

            try {
                if (await smartlingSettingsServiceApi.deleteProjectLevelSettings(projectId, integrationId)) {
                    logger.info("Deleted settings");
                }
            } catch (e) {
                try {
                    const errorPayload = JSON.parse(JSON.parse(e.payload));
                    if (errorPayload) {
                        if (errorPayload.response.errors[0].message === "Forbidden") {
                            console.info(`Unable to delete settings for projectId=${projectId} and integrationId=${integrationId}. Only administrators can delete settings.`);
                        }
                    }
                } catch (parseError) {
                    console.warn(e);
                }
            }
        }
    } catch (e) {
        console.warn(e);
    }
})();
