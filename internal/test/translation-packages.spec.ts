import "mocha"
import sinon from "sinon";
import assert from "assert";
import {SmartlingTranslationPackagesApi} from "../api/translation-package";
import {CreateTranslationPackagesParameters} from "../api/translation-package/params/create-translation-packages-parameters";
import {StateEnum} from "../api/translation-package/params/state-enum";
import {UpdateTranslationPackagesParameters} from "../api/translation-package/params/update-translation-packages-parameters";
import {SortByEnum} from "../api/translation-package/params/sort-by-enum";
import {OrderByEnum} from "../api/translation-package/params/order-by-enum";
import {SearchTranslationPackagesParameters} from "../api/translation-package/params/search-translation-packages-parameters";

const {loggerMock, authMock, responseMock} = require("./mock");
const title = "testTitle";
const packageKey = {
	"configUid": "xxx",
	"filePath": "resources/strings.xml",
	"prId": 15
};
const customData = {
	"foo": "bar"
};

const projectId = "testProjectId";
const integrationId = "testIntegrationId";
const translationPackageUid = "testTranslationPackageUid";

describe("SmartlingPropertyMappingsApi class tests.", () => {
	let translationPackagesApi: SmartlingTranslationPackagesApi;
	let translationPackagesServiceApiFetchStub;
	let translationPackagesServiceApiUaStub;
	let responseMockJsonStub;

	beforeEach(() => {

		translationPackagesApi = new SmartlingTranslationPackagesApi(authMock, loggerMock, "https://test.com");
		translationPackagesServiceApiFetchStub = sinon.stub(translationPackagesApi, "fetch");
		translationPackagesServiceApiUaStub = sinon.stub(translationPackagesApi, "ua");
		responseMockJsonStub = sinon.stub(responseMock, "json");

		translationPackagesServiceApiUaStub.returns("test_user_agent");
		translationPackagesServiceApiFetchStub.returns(responseMock);
		responseMockJsonStub.returns({
			response: {}
		});
	});

	afterEach(() => {
		translationPackagesServiceApiFetchStub.restore();
		responseMockJsonStub.restore();
		translationPackagesServiceApiUaStub.restore();
	});

	describe("Params", () => {
		it("Create translation packages parameters", () => {
			const translationPackagesParameters = new CreateTranslationPackagesParameters();
			translationPackagesParameters.setCustomData(customData)
				.setPackageKey(packageKey)
				.setTitle(title);
			assert.deepEqual(
				{
					packageKey: packageKey,
					customData: customData,
					title: title
				},
				translationPackagesParameters.export()
			);
		});
	});

	describe("Methods", () => {
		it("Should create project translation package", async () => {
			const expectedBodyParams = {
				customData: customData,
				packageKey: packageKey,
				title: title
			};
			const translationPackagesParameters = new CreateTranslationPackagesParameters();
			translationPackagesParameters
				.setCustomData(customData)
				.setPackageKey(packageKey)
				.setTitle(title);

			await translationPackagesApi.createTranslationPackage(projectId, integrationId, translationPackagesParameters);

			sinon.assert.calledOnce(translationPackagesServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				translationPackagesServiceApiFetchStub,
				`https://test.com/submission-service-api/v2/projects/${projectId}/buckets/${integrationId}/translation-packages`,
				{
					body: JSON.stringify(expectedBodyParams),
					headers: {
						"Authorization": "test_token_type test_access_token",
						"Content-Type": "application/json",
						"User-Agent": "test_user_agent"
					},
					method: "post"
				}
			);
		});

		it("Should get project translation package", async () => {
			await translationPackagesApi.getTranslationPackage(projectId, integrationId, translationPackageUid);

			sinon.assert.calledOnce(translationPackagesServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				translationPackagesServiceApiFetchStub,
				`https://test.com/submission-service-api/v2/projects/${projectId}/buckets/${integrationId}/translation-packages/${translationPackageUid}`, {
					headers: {
						"Authorization": "test_token_type test_access_token",
						"Content-Type": "application/json",
						"User-Agent": "test_user_agent"
					},
					method: "get"
				}
			);
		});

		it("Should search for the project translation packages", async () => {
			const limit = 100;
			const offset = 0;
			const sortBy = SortByEnum.MODIFIED_DATE;
			const orderBy = OrderByEnum.ASC;
			const state = StateEnum.COMPLETED;
			const expectedParams = `offset=${offset}&limit=${limit}&sortBy=${sortBy}&state=${state}&orderBy=${orderBy}&title=${title}&packageKey=${encodeURIComponent(JSON.stringify(packageKey))}&customData=${encodeURIComponent(JSON.stringify(customData))}`;

			const searchTranslationRequestParameters = new SearchTranslationPackagesParameters();
			searchTranslationRequestParameters.setOffset(offset)
				.setOffset(offset)
				.setLimit(limit)
				.setSortBy(sortBy)
				.setState(state)
				.setOrderBy(orderBy)
				.setTitle(title)
				.setPackageKey(packageKey)
				.setCustomData(customData);

			await translationPackagesApi.searchTranslationPackages(
				projectId,
				integrationId,
				searchTranslationRequestParameters
			);

			sinon.assert.calledOnce(translationPackagesServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				translationPackagesServiceApiFetchStub,
				`https://test.com/submission-service-api/v2/projects/${projectId}/buckets/${integrationId}/translation-packages?${expectedParams}`,
				{
					headers: {
						"Authorization": "test_token_type test_access_token",
						"Content-Type": "application/json",
						"User-Agent": "test_user_agent"
					},
					method: "get"
				}
			);
		});

		it("Should update project property mappings", async () => {
			const expectedBodyParams = {
				customData: customData,
				lastErrorMessage: "testLastErrorMessage",
				packageKey: packageKey,
				state: StateEnum.DRAFT,
				title: title,
				version: 1
			};
			const updateTranslationPackageParameters = new UpdateTranslationPackagesParameters();
			updateTranslationPackageParameters
				.setCustomData(customData)
				.setLastErrorMessage("testLastErrorMessage")
				.setPackageKey(packageKey)
				.setState(StateEnum.DRAFT)
				.setTitle(title)
				.setVersion(1);
			await translationPackagesApi.updateTranslationPackage(
				projectId,
				integrationId,
				translationPackageUid,
				updateTranslationPackageParameters
			);

			sinon.assert.calledOnce(translationPackagesServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				translationPackagesServiceApiFetchStub,
				`https://test.com/submission-service-api/v2/projects/${projectId}/buckets/${integrationId}/translation-packages/${translationPackageUid}`,
				{
					body: JSON.stringify(expectedBodyParams),
					headers: {
						"Authorization": "test_token_type test_access_token",
						"Content-Type": "application/json",
						"User-Agent": "test_user_agent"
					},
					method: "put"
				}
			);
		});
	});
});
