import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import {LocaleParameters} from "./parameters/locale-parameters";
import {HTTPResponse} from "../http/response";

export class SmartlingLocaleAPI extends SmartlingBaseApi {
	private readonly authApi: SmartlingAuthApi;
	private readonly entrypoint: string;

	constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
		super(logger);
		this.authApi = authApi;
		this.entrypoint = `${smartlingApiBaseUrl}/locales-api/v2`;
	}

	public async listLocales(params: LocaleParameters): Promise<HTTPResponse<any>> {
		return await this.makeRequest(
			"get",
			`${this.entrypoint}/dictionary/locales`,
			params.export()
		);
	}
}
