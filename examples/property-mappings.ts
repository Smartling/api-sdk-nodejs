import {SmartlingApiClientBuilder} from "../api/builder";
import {SmartlingPropertyMappingsApi} from "../api/property-mappings";
import {PropertyMappingsParameters} from "../api/property-mappings/params/property-mappings-parameters";
import {MappingParameters} from "../api/property-mappings/params/mapping-parameters";
import {PropertyParameters} from "../api/property-mappings/params/property-parameters";
import {ActionEnum} from "../api/property-mappings/params/action-enum";

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

	const propertyParameters: PropertyParameters = (new PropertyParameters())
		.setContentType("contactPage")
		.setName("title")
		.setSpace("q2fjg5qulqq8");
	const mappingParameters: MappingParameters = (new MappingParameters())
		.setAction(ActionEnum.TRANSLATE);
	const propertyMappingsParameters: PropertyMappingsParameters = (new PropertyMappingsParameters())
		.setMapping(mappingParameters)
		.setProperty(propertyParameters);

	(async () => {
		try {
			await propertyMappingsApi.createProjectPropertyMapping(projectId, integrationId, propertyMappingsParameters);

			logger.info(
				JSON.stringify(
					await propertyMappingsApi.getProjectPropertyMappings(projectId, integrationId),
					null,
					2
				)
			);

			logger.info(
				JSON.stringify(
					await propertyMappingsApi.searchProjectPropertyMappings(projectId, integrationId, propertyParameters),
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
