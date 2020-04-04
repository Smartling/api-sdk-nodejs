const SmartlingTranslationRequestsApi = require("../api/translation-requests");
const TranslationSubmissionStates = require("../api/translation-requests/params/translation-submission-states");
const CreateTranslationSubmissionParams = require("../api/translation-requests/params/create-translation-submission-params");
const CreateTranslationRequestParams = require("../api/translation-requests/params/create-translation-request-params");
const UpdateTranslationSubmissionParams = require("../api/translation-requests/params/update-translation-submission-params");
const UpdateTranslationRequestParams = require("../api/translation-requests/params/update-translation-request-params");
const SearchTranslationRequestParams = require("../api/translation-requests/params/search-translation-request-parameters");
const { SmartlingApiFactory } = require("../api/factory");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const baseUrl = "https://api.smartling.com";
    const apiFactory = new SmartlingApiFactory(userId, userSecret, baseUrl, logger);
    const smartlingTranslationRequestsApi = apiFactory.createApiClient(SmartlingTranslationRequestsApi);

    smartlingTranslationRequestsApi.clientLibId = "testClientLibId";
    smartlingTranslationRequestsApi.clientLibVersion = "testClientLibVersion";

    (async () => {
        try {
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
                .createTranslationRequest(
                    projectId,
                    bucketName,
                    createTranslationRequestParameters
                );

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
