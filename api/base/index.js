const SmartlingException = require("../exception");
const fetch = require("node-fetch");
const querystring = require("querystring");
const ua = require("default-user-agent");
const merge = require("merge-deep");

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


class SmartlingBaseApi {
    constructor(logger) {
        this.defaultClientLibId = "smartling-api-sdk-node";
        this.defaultClientVersion = "1.3.3";
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
        return fetch(uri, options);
    }

    ua(clientId, clientVersion) {
        return ua(clientId, clientVersion);
    }

    alterRequestData(uri, opts) {
        return opts;
    }

    async getDefaultHeaders() {
        let headers = {};

        /* eslint-disable-next-line no-prototype-builtins */
        if (this.hasOwnProperty("authApi") && undefined !== this.authApi) {
            const accessToken = await this.authApi.getAccessToken();
            const tokenType = await this.authApi.getTokenType();

            headers = {
                Authorization: `${tokenType} ${accessToken}`
            };
        }

        headers["Content-Type"] = "application/json";
        headers["User-Agent"] = this.ua(this.clientLibId, this.clientLibVersion);

        return headers;
    }

    async makeRequest(verb, uri, payload, returnRawResponseBody = false) {
        const opts = merge({
            method: verb,
            headers: await this.getDefaultHeaders()
        }, this.options);

        if (verb.toLowerCase() !== "get") {
            opts.body = payload;
        } else if (payload) {
            // Package node-fetch doesn't support query parameters.
            // Let's add them manually.
            uri = `${uri}?${querystring.stringify(payload)}`;
        }

        let response = await this.fetch(uri, this.alterRequestData(uri, opts));

        if (response.status === 401) {
            this.logger.warn("Got unexpected 401 response code, trying to re-auth carefully...");

            this.authApi.resetToken();

            response = await this.fetch(uri, this.alterRequestData(uri, {
                method: verb,
                headers: await this.getDefaultHeaders()
            }));
        }

        if (response.status >= 400) {
            const jsonResponse = await response.text();

            throw new SmartlingException(`Request for ${uri} failed: ${response.status}`, JSON.stringify(jsonResponse));
        }

        // Special case for file download - return raw response text.
        if (returnRawResponseBody) {
            return response.text();
        }

        try {
            const jsonResponse = await response.json();

            this.logger.debug(`Received code ${response.status}; content: ${JSON.stringify(jsonResponse)}`);

            return jsonResponse.response.data ? jsonResponse.response.data : true;
        } catch (e) {
            this.logger.error(`Couldn't parse response json: ${e.toString()}`);

            throw new SmartlingException(response.status, JSON.stringify(response), e);
        }
    }
}

module.exports = SmartlingBaseApi;
