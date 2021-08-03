import { Logger } from "../logger";
import { SmartlingException } from "../exception";
import * as fetch from "node-fetch";
import * as querystring from "querystring";
import ua from "default-user-agent";
import merge from "merge-deep";
import { SmartlingAuthApi } from "../auth";

const packageJson = require("../../package.json");

/*
 eslint class-methods-use-this: [
     "error", {
         "exceptMethods": [
            "fetch",
            "ua",
            "alterRequestData"
         ]
     }
 ]
 */

export class SmartlingBaseApi {
    protected authApi: SmartlingAuthApi = undefined;
    protected entrypoint: string;
    protected defaultClientLibId: string;
    protected defaultClientVersion: string;
    protected clientLibId: string;
    protected clientLibVersion: string;
    protected response: any;
    protected logger: Logger;
    protected options: any;

    constructor(logger: Logger) {
        this.defaultClientLibId = packageJson.name;
        this.defaultClientVersion = packageJson.version;
        this.clientLibId = this.defaultClientLibId;
        this.clientLibVersion = this.defaultClientVersion;
        this.response = {};
        this.logger = logger;
        this.options = {};
    }

    setOptions(options) {
        this.options = options;
    }

    static get clientLibId() {
        return SmartlingBaseApi.clientLibId;
    }

    static set clientLibId(value) {
        SmartlingBaseApi.clientLibId = value;
    }

    static get clientLibVersion() {
        return SmartlingBaseApi.clientLibVersion;
    }

    static set clientLibVersion(value) {
        SmartlingBaseApi.clientLibVersion = value;
    }

    async fetch(uri, options) {
        return await fetch(uri, options);
    }

    ua(clientId, clientVersion) {
        return ua(clientId, clientVersion);
    }

    alterRequestData(uri, opts) {
        return opts;
    }

    async getDefaultHeaders(headers = {}) {
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

    async makeRequest(verb, uri, payload = null, returnRawResponseBody = false, headers = {}) {
        const opts = merge({
            method: verb,
            headers: await this.getDefaultHeaders(headers)
        }, this.options);

        if (verb.toLowerCase() !== "get" && payload) {
            opts.body = payload;
        } else if (payload) {
            // Package node-fetch doesn't support query parameters.
            // Let's add them manually.
            uri = `${uri}?${querystring.stringify(payload)}`;
        }

        let response = await this.fetch(uri, this.alterRequestData(uri, opts));

        if (response.status === 401) {
            this.logger.warn("Got unexpected 401 response code, trying to re-auth carefully...");

            /* eslint-disable-next-line no-prototype-builtins */
            if (this.hasOwnProperty("authApi") && this.authApi !== undefined) {
                this.authApi.resetToken();
            }

            opts.headers = await this.getDefaultHeaders(headers);

            response = await this.fetch(uri, this.alterRequestData(uri, opts));
        }

        if (response.status >= 400) {
            const responseText = await response.text();

            throw new SmartlingException(`Request for ${uri} failed`, JSON.stringify({
                statusCode: response.status,
                errorResponse: responseText,
                requestId: response.headers.get("x-sl-requestid")
            }));
        }

        // Special case for file download - return raw response text.
        if (returnRawResponseBody) {
            return response.text();
        }

        try {
            const jsonResponse = await response.json();

            this.logger.debug(`Received code ${response.status}; content: ${JSON.stringify(jsonResponse)}`);

            return jsonResponse?.response?.data ? jsonResponse?.response?.data : true;
        } catch (e) {
            this.logger.error(`Couldn't parse response json: ${e.toString()}`);

            throw new SmartlingException("Couldn't parse response json", JSON.stringify({
                statusCode: response.status,
                errorResponse: await response.text(),
                requestId: response.headers.get("x-sl-requestid")
            }));
        }
    }
}
