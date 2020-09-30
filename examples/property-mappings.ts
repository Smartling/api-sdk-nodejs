import {SmartlingApiClientBuilder} from "../api/builder";
import {SmartlingPropertyMappingsApi} from "../api/property-mappings";
import BaseParameters from "../api/parameters";

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;
const integrationId = process.env.INTEGRATION_ID;

if (projectId) {
	const baseUrl = "https://api.smartling.com";
	const propertyMappingsApi = new SmartlingApiClientBuilder()
		.setLogger(logger)
		.setBaseSmartlingApiUrl(baseUrl)
		.setClientLibMetadata("example-lib-name", "example-lib-version")
		.setHttpClientConfiguration({
			timeout: 10000
		})
		.authWithUserIdAndUserSecret(userId, userSecret)
		.build(SmartlingPropertyMappingsApi);

	const baseParameters: BaseParameters = new BaseParameters({key: "key", value: "value"});

	(async () => {
		try {
			await propertyMappingsApi.createProjectPropertyMapping(projectId, integrationId, baseParameters);

			logger.info(
				JSON.stringify(
					await propertyMappingsApi.getProjectPropertyMappings(projectId, integrationId),
					null,
					2
				)
			);

			logger.info(
				JSON.stringify(
					await propertyMappingsApi.searchProjectPropertyMappings(projectId, integrationId, baseParameters),
					null,
					2
				)
			);
		} catch (e) {
			console.log(e);
		}
	})();
} else {
	logger.info("Must specify projectId");
}
