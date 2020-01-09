const SmartlingBaseApi = require("../base");
const SmartlingException = require("../exception");
const fs = require("fs");
const FormData = require("form-data");

/*
    eslint class-methods-use-this: [
        "error", {
            "exceptMethods": [
                "checkFile"
            ]
        }
    ]
 */

class SmartlingTranslationApi extends SmartlingBaseApi {
    constructor(authApi, logger, smartlingApiBaseUrl) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/translations-api/v2/`;
    }

    async checkFile(fileName) {
        const res = await fs.accessSync(fileName, fs.constants.R_OK);
        return !res;
    }

    async createTranslationPackage(projectId, translationJobUid, localeId, workflowStepUid) {
        return this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/locales/${localeId}/translation-packages`,
            JSON.stringify({
                workflowStepUid,
                translationJobUid
            })
        );
    }

    async getTranslationPackage(projectId, translationPackageUid) {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectId}/translation-packages/${translationPackageUid}`
        );
    }

    async getTranslationPackageContent(projectId, translationPackageUid) {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectId}/translation-packages/${translationPackageUid}/content`,
            null,
            true
        );
    }

    async importTranslations(projectId, localeId, filePath, fileName) {
        if (!await this.checkFile(`${filePath}${fileName}`)) {
            throw new SmartlingException(`Cannot read file ${filePath}${fileName}`);
        }

        const readStream = fs.createReadStream(`${filePath}${fileName}`);
        const form = new FormData();

        form.append("file", readStream);

        const opts = this.options;
        const headers = form.getHeaders();

        headers["Content-Type"] = headers["content-type"];
        // eslint-disable-next-line fp/no-delete
        delete headers["content-type"];

        this.options = {
            headers
        };

        try {
            return await this.makeRequest(
                "post",
                `${this.entrypoint}/projects/${projectId}/locales/${localeId}/content`,
                form
            );
        } finally {
            this.options = opts;
        }
    }
}

module.exports = SmartlingTranslationApi;
