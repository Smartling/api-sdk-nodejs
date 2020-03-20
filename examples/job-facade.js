const SmartlingAuthApi = require("../api/auth");
const SmartlingJobFacadeApi = require("../api/job-facade");
const CreateBatchParameters = require("../api/job-facade/params/create-batch-parameters");
const UploadFileParameters = require("../api/job-facade/params/upload-file-parameters");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const authApi = new SmartlingAuthApi(
        userId,
        userSecret,
        logger,
        "https://api.smartling.com"
    );
    const smartlingJobFacadeApi = new SmartlingJobFacadeApi(authApi, logger, "https://api.smartling.com");

    (async () => {
        try {
            const createBatchParams = new CreateBatchParameters();

            createBatchParams
                .setTranslationJobUid("test")
                .setAuthorize(true);

            logger.debug("-------- Create batch ---------");

            const createBatchResult = await smartlingJobFacadeApi
                .createBatch(projectId, createBatchParams);

            logger.debug(JSON.stringify(createBatchResult, null, 2));

            logger.debug("-------- Get batch status ---------");

            const getBatchStatusResult = await smartlingJobFacadeApi
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

            const uploadFileResult = await smartlingJobFacadeApi
                .uploadBatchFile(projectId, createBatchResult.batchUid, uploadFileParams);

            logger.debug(JSON.stringify(uploadFileResult, null, 2));

            logger.debug("-------- Execute batch ---------");

            const executeBatchStatusResult = await smartlingJobFacadeApi
                .executeBatch(projectId, createBatchResult.batchUid);

            logger.debug(JSON.stringify(executeBatchStatusResult, null, 2));
        } catch (e) {
            logger.error(e);
        }
    })();
}
