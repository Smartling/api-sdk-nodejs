import merge from "merge-deep";
import ua from "default-user-agent";
import FormData from "form-data";
import fetch from "cross-fetch";
import { ParsedUrlQueryInput, stringify } from "querystring";
import { Logger } from "../logger";
import { SmartlingException } from "../exception/index";
import { SmartlingAuthApi } from "../auth/index";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const packageJson = require("../../package.json");

export class SmartlingBaseApi {
    protected authApi: SmartlingAuthApi = undefined;
    protected entrypoint: string;
    protected defaultClientLibId: string;
    protected defaultClientVersion: string;
    protected clientLibId: string;
    protected clientLibVersion: string;
    protected logger: Logger;
    protected options: Record<string, unknown>;

    constructor(logger: Logger) {
        this.defaultClientLibId = packageJson.name;
        this.defaultClientVersion = packageJson.version;
        this.clientLibId = this.defaultClientLibId;
        this.clientLibVersion = this.defaultClientVersion;
        this.logger = logger;
        this.options = {};
    }

    setOptions(options: Record<string, unknown>): void {
        this.options = options;
    }

    public getClientLibId(): string {
        return this.clientLibId;
    }

    public setClientLibId(clientLibId: string): void {
        this.clientLibId = clientLibId;
    }

    public getClientLibVersion(): string {
        return this.clientLibVersion;
    }

    public setClientLibVersion(clientLibVersion: string): void {
        this.clientLibVersion = clientLibVersion;
    }

    /* eslint-disable-next-line class-methods-use-this */
    async fetch(uri: string, options: Record<string, unknown>): Promise<Response> {
        return await fetch(uri, options);
    }

    /* eslint-disable-next-line class-methods-use-this */
    ua(clientId: string, clientVersion: string): string {
        return ua(clientId, clientVersion);
    }

    /* eslint-disable-next-line class-methods-use-this */
    alterRequestData(uri: string, opts: Record<string, unknown>): Record<string, unknown> {
        return opts;
    }

    async getDefaultHeaders(
        headers: Record<string, unknown> = {}
    ): Promise<Record<string, unknown>> {
        let defaultHeaders = {};

        /* eslint-disable-next-line no-prototype-builtins */
        if (this.hasOwnProperty("authApi") && undefined !== this.authApi) {
            const accessToken = await this.authApi.getAccessToken();
            const tokenType = await this.authApi.getTokenType();

            defaultHeaders = {
                Authorization: `${tokenType} ${accessToken}`
            };
        }

        defaultHeaders["Content-Type"] = "application/json";
        defaultHeaders["User-Agent"] = this.ua(this.clientLibId, this.clientLibVersion);

        return merge(defaultHeaders, headers);
    }

    async makeRequest(
        verb: string,
        uri: string,
        payload: Record<string, unknown> | string | FormData = null,
        returnRawResponseBody = false,
        headers: Record<string, unknown> = {}
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ): Promise<any> {
        const opts = merge({
            method: verb,
            headers: await this.getDefaultHeaders(headers)
        }, this.options);

        if (verb.toLowerCase() !== "get" && payload) {
            opts.body = payload;
        } else if (payload) {
            // Package node-fetch doesn't support query parameters.
            // Let's add them manually.
            uri = `${uri}?${stringify(payload as unknown as ParsedUrlQueryInput)}`;
        }

        let response = await this.fetch(uri, this.alterRequestData(uri, opts));

        if (response.status === 401) {
            this.logger.warn("Got unexpected 401 response code, trying to re-auth carefully...");

            /* eslint-disable-next-line no-prototype-builtins */
            if (this.hasOwnProperty("authApi") && this.authApi !== undefined) {
                this.authApi.resetToken();
            }

            // Do not override http client headers set by SmartlingBaseApi.setOptions().
            const defaultHeaders = await this.getDefaultHeaders(headers);
            opts.headers.Authorization = defaultHeaders.Authorization;

            response = await this.fetch(uri, this.alterRequestData(uri, opts));
        }

        if (response.status >= 400) {
            const responseText = await response.text();

            throw new SmartlingException(`Request for ${uri} failed`, {
                statusCode: response.status,
                errorResponse: responseText,
                requestId: response.headers.get("x-sl-requestid")
            });
        }

        // Special case for file download - return raw response text.
        if (returnRawResponseBody) {
            return response.text();
        }

        try {
            const textResponse = await response.text();
            const jsonResponse = JSON.parse(textResponse, (key, value) => {
                const dateProperties = [
                    "created",
                    "modified",
                    "updated",
                    "createdDate",
                    "modifiedDate",
                    "updatedDate",
                    "dueDate",
                    "actionTime",
                    "publishDate",
                    "lastModified"
                ];

                if (dateProperties.includes(key) && value) {
                    return new Date(value);
                }

                return value;
            });

            this.logger.debug(`Received code ${response.status}; content: ${JSON.stringify(jsonResponse, SmartlingBaseApi.sensitiveReplacer)}`);

            return jsonResponse?.response?.data ? jsonResponse?.response?.data : true;
        } catch (e) {
            this.logger.error(`Couldn't parse response json: ${e.toString()}`);

            throw new SmartlingException("Couldn't parse response json", {
                statusCode: response.status,
                errorResponse: await response.text(),
                requestId: response.headers.get("x-sl-requestid")
            });
        }
    }

    public static sensitiveReplacer(key: string, value: any): any {
        const sensitiveProperties = [
            "userIdentifier",
            "userSecret",
            "accessToken",
            "refreshToken"
        ];

        if (sensitiveProperties.includes(key) && value && typeof value === "string") {
            return `${value.substring(0, 10)}xxxxx`;
        }

        return value;
    }
}
