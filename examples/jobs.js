const SmartlingJobsApi = require("../api/jobs");
const ListJobsParameters = require("../api/jobs/params/list-jobs-parameters");
const ListJobFilesParameters = require("../api/jobs/params/list-job-files-parameters");
const CreateJobParameters = require("../api/jobs/params/create-job-parameters");
const RemoveFileParameters = require("../api/jobs/params/remove-file-parameters");
const JobStatuses = require("../api/jobs/params/job-statuses");
// eslint-disable-next-line import/no-unresolved
const { SmartlingApiClientBuilder } = require("../api/builder");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const baseUrl = "https://api.smartling.com";
    const smartlingJobsApi = new SmartlingApiClientBuilder()
        .setLogger(logger)
        .setBaseSmartlingApiUrl(baseUrl)
        .setClientLibMetadata("example-lib-name", "example-lib-version")
        .setHttpClientConfiguration({
            timeout: 10000
        })
        .authWithUserIdAndUserSecret(userId, userSecret)
        .build(SmartlingJobsApi);

    (async () => {
        try {
            logger.debug("-------- Remove file from job ---------");

            const removeFileParameters = new RemoveFileParameters();

            removeFileParameters.setFileUri("fileUri.xml");

            await smartlingJobsApi.removeFileFromJob(projectId, "jobUid", removeFileParameters);

            logger.debug("-------- Create job ---------");

            const createJobParams = new CreateJobParameters();

            createJobParams
                .setName(`Job api-sdk-nodejs test name ${Math.random()}`)
                .setDescription("Job api-sdk-nodejs test description")
                .setDueDate(new Date("2037-12-17T03:24:00"));

            const createJobResponse = await smartlingJobsApi.createJob(projectId, createJobParams);

            logger.debug(JSON.stringify(createJobResponse, null, 2));

            logger.debug("-------- Get job ---------");

            const getJobResponse = await smartlingJobsApi
                .getJob(projectId, createJobResponse.translationJobUid);

            logger.debug(JSON.stringify(getJobResponse, null, 2));

            logger.debug("-------- Get job files ---------");

            const listJobFilesParameters = new ListJobFilesParameters();

            listJobFilesParameters
                .setLimit(500)
                .setOffset(0);

            const getJobFilesResponse = await smartlingJobsApi
                .getJobFiles(
                    projectId,
                    createJobResponse.translationJobUid,
                    listJobFilesParameters
                );

            logger.debug(JSON.stringify(getJobFilesResponse, null, 2));

            logger.debug("-------- List jobs ---------");

            const listJobsParams = new ListJobsParameters();

            listJobsParams
                .setOffset(0)
                .setLimit(10)
                .setName("api-sdk-nodejs")
                .setStatuses([
                    JobStatuses.AWAITING_AUTHORIZATION,
                    JobStatuses.CANCELLED
                ]);

            const listJobsResponse = await smartlingJobsApi.listJobs(projectId, listJobsParams);

            logger.debug(JSON.stringify(listJobsResponse, null, 2));
        } catch (e) {
            logger.error(e);
        }
    })();
}
