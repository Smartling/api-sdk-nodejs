import {SmartlingApiClientBuilder} from "../api/builder";
import {SmartlingPropertyMappingsApi} from "../api/property-mappings";
import {PropertyMappingParameters} from "../api/property-mappings/parameters/property-mapping-parameters";

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

	const property = {key: "key", value: "value"};
	const mapping = {name: "anyMapping"};
	const propertyMappingParameters: PropertyMappingParameters = new PropertyMappingParameters()
		.setProperty(property)
		.setMapping(mapping);

	(async () => {
		try {
			await propertyMappingsApi.createProjectPropertyMapping(projectId, integrationId, propertyMappingParameters);

			logger.info(
				JSON.stringify(
					await propertyMappingsApi.getProjectPropertyMappings(projectId, integrationId),
					null,
					2
				)
			);

			logger.info(
				JSON.stringify(
					await propertyMappingsApi.searchProjectPropertyMappings(projectId, integrationId, propertyMappingParameters),
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
