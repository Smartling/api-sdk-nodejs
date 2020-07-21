const SmartlingJobApi = require("../api/job");
const ListJobsParameters = require("../api/job/params/list-jobs-parameters");
const ListJobFilesParameters = require("../api/job/params/list-job-files-parameters");
const CreateJobParameters = require("../api/job/params/create-job-parameters");
const JobStatuses = require("../api/job/params/job-statuses");
// eslint-disable-next-line import/no-unresolved
const { SmartlingApiClientBuilder } = require("../api/builder");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const baseUrl = "https://api.smartling.com";
    const smartlingJobApi = new SmartlingApiClientBuilder()
        .withLogger(logger)
        .withBaseSmartlingApiUrl(baseUrl)
        .withClientLibMetadata("example-lib-name", "example-liv-version")
        .withHttpClientConfiguration({
            timeout: 10000
        })
        .authWithUserIdAndUserSecret(userId, userSecret)
        .build(SmartlingJobApi);

    (async () => {
        try {
            logger.debug("-------- Create job ---------");

            const createJobParams = new CreateJobParameters();

            createJobParams
                .setName(`Job api-sdk-nodejs test name ${Math.random()}`)
                .setDescription("Job api-sdk-nodejs test description")
                .setDueDate(new Date("2037-12-17T03:24:00"));

            const createJobResponse = await smartlingJobApi.createJob(projectId, createJobParams);

            logger.debug(JSON.stringify(createJobResponse, null, 2));

            logger.debug("-------- Get job ---------");

            const getJobResponse = await smartlingJobApi
                .getJob(projectId, createJobResponse.translationJobUid);

            logger.debug(JSON.stringify(getJobResponse, null, 2));

            logger.debug("-------- Get job files ---------");

            const listJobFilesParameters = new ListJobFilesParameters();

            listJobFilesParameters
                .setLimit(500)
                .setOffset(0);

            const getJobFilesResponse = await smartlingJobApi
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

            const listJobsResponse = await smartlingJobApi.listJobs(projectId, listJobsParams);

            logger.debug(JSON.stringify(listJobsResponse, null, 2));
        } catch (e) {
            logger.error(e);
        }
    })();
}
