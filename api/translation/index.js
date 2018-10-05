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

    async createTranslationPackage(projectId, jobUid, localeId, workflowStepUid) {
        return this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/locales/${localeId}/translation-packages`,
            JSON.stringify({
                workflowStepUid,
                jobUid
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
            `${this.entrypoint}/projects/${projectId}/translation-packages/${translationPackageUid}/content`
        );
    }

    async importTranslations(projectId, localeId, filePath, fileName) {
        if (!await this.checkFile(`${filePath}${fileName}`)) {
            throw new SmartlingException(`Cannot read file ${filePath}${fileName}`);
        }

        const readStream = fs.createReadStream(`${filePath}${fileName}`);
        const form = new FormData();

        form.append("file", readStream);

        const header = form.getHeaders();
        const authHeader = await this.getAuthHeader();

        header.Authorization = authHeader.Authorization;

        return this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/locales/${localeId}/content`,
            header,
            form
        );
    }
}

module.exports = SmartlingTranslationApi;
