import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import {ContextUploadParameters} from "./params/context-upload-parameters"
import {ContextDto} from "./dto/context-dto";
import {ContextAutomaticMatchParameters} from "./params/context-automatic-match-parameters";
import {ContextMatchAsyncDto} from "./dto/context-match-async-dto";

export class SmartlingContextApi extends SmartlingBaseApi {
	private readonly authApi: SmartlingAuthApi;
	private readonly entrypoint: string;

	constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
		super(logger);

		this.authApi = authApi;
		this.entrypoint = `${smartlingApiBaseUrl}/context-api/v2/projects/`;
	}

	async upload(projectId: string, params: ContextUploadParameters): Promise<ContextDto> {
		return await this.makeRequest(
			"post",
			`${this.entrypoint}/${projectId}/contexts`,
			params.export()
		);
	}

	async runAutomaticMatch(projectId: string, contextUid: string, params: ContextAutomaticMatchParameters): Promise<ContextMatchAsyncDto> {
		return await this.makeRequest(
			"post",
			`${this.entrypoint}/${projectId}/contexts/${contextUid}/match/async`,
			params.export()
		);
	}
}
