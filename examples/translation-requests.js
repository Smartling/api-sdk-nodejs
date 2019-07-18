const program = require("commander");
const SmartlingAuthApi = require("../api/auth");
const SmartlingTranslationRequestsApi = require("../api/translation-requests");
const winston = require("winston");
const TranslationSubmissionStates = require("../api/translation-requests/params/translation-submission-states");
const CreateTranslationSubmissionParams = require("../api/translation-requests/params/create-translation-submission-params");
const CreateTranslationRequestParams = require("../api/translation-requests/params/create-translation-request-params");
const UpdateTranslationSubmissionParams = require("../api/translation-requests/params/update-translation-submission-params");
const UpdateTranslationRequestParams = require("../api/translation-requests/params/update-translation-request-params");
const SearchTranslationRequestParams = require("../api/translation-requests/params/search-translation-request-parameters");

const transports = [
    new winston.transports.Console({
        timestamp: true,
        colorize: true,
        level: "debug"
    })
];
const logger = new winston.Logger({ transports });

program
    .version("0.0.1")
    .option("-u, --identifier <identifier>", "User Identifier")
    .option("-t, --secret <secret>", "Token Secret")
    .parse(process.argv);

if (program.identifier && program.secret) {
    const authApi = new SmartlingAuthApi(
        program.identifier,
        program.secret,
        logger,
        "https://api.smartling.com"
    );
    const smartlingTranslationRequestsApi = new SmartlingTranslationRequestsApi(
        authApi,
        logger,
        "https://api.smartling.com"
    );

    (async () => {
        try {
            const projectId = "test";
            const bucketName = "test";

            const createTranslationSubmissionParameters1 = new CreateTranslationSubmissionParams();
            const createTranslationSubmissionParameters2 = new CreateTranslationSubmissionParams();
            const createTranslationRequestParameters = new CreateTranslationRequestParams();

            createTranslationSubmissionParameters1
                .setTargetLocaleId("fr-FR")
                .setState(TranslationSubmissionStates.NEW)
                .setTargetAssetKey({ foo1: "bar1" })
                .setSubmittedDate(new Date())
                .setSubmitterName("nodejs");

            createTranslationSubmissionParameters2
                .setTargetLocaleId("de-DE")
                .setState(TranslationSubmissionStates.NEW)
                .setTargetAssetKey({ foo2: "bar2" })
                .setSubmittedDate(new Date())
                .setSubmitterName("nodejs");

            createTranslationRequestParameters
                .setOriginalAssetKey({ foo: "bar" })
                .setTitle("Translation request nodejs #1")
                .setFileUri("/nodejs/sdk/test/1.xml")
                .setContentHash("test_hash")
                .setOriginalLocaleId("en")
                .addTranslationSubmission(createTranslationSubmissionParameters1)
                .addTranslationSubmission(createTranslationSubmissionParameters2);

            const createTranslationRequestResponse = await smartlingTranslationRequestsApi
                .createTranslationRequest(projectId, bucketName, createTranslationRequestParameters);

            const getTranslationRequestResponse = await smartlingTranslationRequestsApi
                .getTranslationRequest(
                    projectId,
                    bucketName,
                    createTranslationRequestResponse.translationRequestUid
                );

            const updateTranslationSubmissionParameters = new UpdateTranslationSubmissionParams();

            updateTranslationSubmissionParameters
                .setTranslationSubmissionUid(
                    getTranslationRequestResponse.translationSubmissions[0].translationSubmissionUid
                )
                .setTargetAssetKey({ foo1updated: "bar1updated" });

            const updateTranslationRequestParameters = new UpdateTranslationRequestParams();

            updateTranslationRequestParameters
                .setTitle("Translation request nodejs #1 UPDATED")
                .addTranslationSubmission(updateTranslationSubmissionParameters);

            await smartlingTranslationRequestsApi
                .updateTranslationRequest(
                    projectId,
                    bucketName,
                    getTranslationRequestResponse.translationRequestUid,
                    updateTranslationRequestParameters
                );

            const searchTranslationRequestParameters = new SearchTranslationRequestParams();

            searchTranslationRequestParameters
                .setOriginalAssetKey({ foo: "bar" })
                .setTargetAssetKey({ foo1updated: "bar1updated" })
                .setFileUri("/nodejs/sdk/test/1.xml")
                .setTargetLocaleId("fr-FR");

            await smartlingTranslationRequestsApi
                .searchTranslationRequests(
                    projectId,
                    bucketName,
                    searchTranslationRequestParameters
                );
        } catch (e) {
            logger.error(e);
        }
    })();
}
