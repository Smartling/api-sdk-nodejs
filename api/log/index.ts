import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import { CreateLogParameters } from "./params/create-log-parameters";

export class SmartlingLogApi extends SmartlingBaseApi {
    private readonly entrypoint: string;

    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.entrypoint = `${smartlingApiBaseUrl}/updates`;
    }

    public async log(payload: CreateLogParameters): Promise<void> {
        await this.makeRequest(
            "post",
            `${this.entrypoint}/status`,
            JSON.stringify(payload.export())
        );
    }
}
