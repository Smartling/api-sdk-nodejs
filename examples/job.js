const SmartlingJobApi = require("../api/job");
const ListJobsParameters = require("../api/job/params/list-jobs-parameters");
const CreateJobParameters = require("../api/job/params/create-job-parameters");
const JobStatuses = require("../api/job/params/job-statuses");
// eslint-disable-next-line import/no-unresolved
const { SmartlingApiFactory } = require("../api/factory");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const baseUrl = "https://api.smartling.com";
    const apiFactory = new SmartlingApiFactory(userId, userSecret, baseUrl, logger);
    const smartlingJobApi = apiFactory.createApiClient(SmartlingJobApi);

    smartlingJobApi.clientLibId = "testClientLibId";
    smartlingJobApi.clientLibVersion = "testClientLibVersion";

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
