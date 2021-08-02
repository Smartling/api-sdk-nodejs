const SmartlingJobBatchesApi = require("../api/job-batches");
const CreateBatchParameters = require("../api/job-batches/params/create-batch-parameters");
const UploadFileParameters = require("../api/job-batches/params/upload-file-parameters");
// eslint-disable-next-line import/no-unresolved
const { SmartlingApiClientBuilder } = require("../api/builder");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const baseUrl = "https://api.smartling.com";
    const smartlingJobBatchesApi = new SmartlingApiClientBuilder()
        .setLogger(logger)
        .setBaseSmartlingApiUrl(baseUrl)
        .setClientLibMetadata("example-lib-name", "example-lib-version")
        .setHttpClientConfiguration({
            timeout: 10000
        })
        .authWithUserIdAndUserSecret(userId, userSecret)
        .build(SmartlingJobBatchesApi);

    (async () => {
        try {
            const createBatchParams = new CreateBatchParameters();

            createBatchParams
                .setTranslationJobUid("ae39gwaudv6q")
                .setAuthorize(true);

            logger.debug("-------- Create batch ---------");

            const createBatchResult = await smartlingJobBatchesApi
                .createBatch(projectId, createBatchParams);

            logger.debug(JSON.stringify(createBatchResult, null, 2));

            logger.debug("-------- Get batch status ---------");

            const getBatchStatusResult = await smartlingJobBatchesApi
                .getBatchStatus(projectId, createBatchResult.batchUid);

            logger.debug(JSON.stringify(getBatchStatusResult, null, 2));

            logger.debug("-------- Upload file to batch ---------");

            const uploadFileParams = new UploadFileParameters();

            uploadFileParams
                .setLocalesToApprove(["fr-FR"])
                .setFile("./examples/data/test.xml")
                .setFileUri("test.xml")
                .setDirective("placeholder_format", "YAML")
                .setFileType("xml");

            const uploadFileResult = await smartlingJobBatchesApi
                .uploadBatchFile(projectId, createBatchResult.batchUid, uploadFileParams);

            logger.debug(JSON.stringify(uploadFileResult, null, 2));

            logger.debug("-------- Execute batch ---------");

            const executeBatchStatusResult = await smartlingJobBatchesApi
                .executeBatch(projectId, createBatchResult.batchUid);

            logger.debug(JSON.stringify(executeBatchStatusResult, null, 2));
        } catch (e) {
            logger.error(e);
        }
    })();
}
