import {SmartlingApiClientBuilder} from "../api/builder";
import {SmartlingLocaleAPI} from "../api/locale";
import {LocaleParameters} from "../api/locale/parameters/locale-parameters";

const logger = console;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;
const baseUrl = "https://api.smartling.com";
const localeApi = new SmartlingApiClientBuilder()
	.setLogger(logger)
	.setBaseSmartlingApiUrl(baseUrl)
	.setClientLibMetadata("example-lib-name", "example-lib-version")
	.setHttpClientConfiguration({
		timeout: 10000
	})
	.authWithUserIdAndUserSecret(userId, userSecret)
	.build(SmartlingLocaleAPI);

const localeIds = ['ru-RU', 'en-US', 'he-IL'];
const localeParameters: LocaleParameters = new LocaleParameters()
	.setLocaleIds(localeIds);

(async () => {
	try {
		logger.info(
			JSON.stringify(
				await localeApi.listLocales(localeParameters),
				null,
				2
			)
		);
	} catch (e) {
		console.log(e);
	}
})();

