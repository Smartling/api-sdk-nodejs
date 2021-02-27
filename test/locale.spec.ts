import "mocha"
import sinon from "sinon";
import assert from "assert";
import {LocaleParameters} from "../api/locale/parameters/locale-parameters";
import {SmartlingLocaleAPI} from "../api/locale";

const {loggerMock, authMock, responseMock} = require("./mock");

const localeIds = ['ru-RU', 'en-US', 'he-IL'];
const expectedQueryParams = localeIds.map(localeId => `localeIds=${localeId}`).join('&');

describe("SmartlingLocaleAPI class tests.", () => {
	let localeApi: SmartlingLocaleAPI;
	let localeServiceApiFetchStub;
	let localeServiceApiUaStub;
	let responseMockJsonStub;
	let localeParameters: LocaleParameters;

	beforeEach(() => {
		localeParameters = new LocaleParameters()
			.setLocaleIds(localeIds);

		localeApi = new SmartlingLocaleAPI(authMock, loggerMock, "https://test.com");
		localeServiceApiFetchStub = sinon.stub(localeApi, "fetch");
		localeServiceApiUaStub = sinon.stub(localeApi, "ua");
		responseMockJsonStub = sinon.stub(responseMock, "json");

		localeServiceApiUaStub.returns("test_user_agent");
		localeServiceApiFetchStub.returns(responseMock);
		responseMockJsonStub.returns({
			response: {}
		});
	});

	afterEach(() => {
		localeServiceApiFetchStub.restore();
		responseMockJsonStub.restore();
		localeServiceApiUaStub.restore();
	});

	describe("Params", () => {
		it("Create locale parameters", () => {
			assert.deepEqual(
				{
					localeIds: localeIds
				},
				localeParameters.export()
			);
		});
	});

	describe("Methods", () => {
		it("Should search for locales", async () => {
			await localeApi.listLocales(localeParameters);

			sinon.assert.calledOnce(localeServiceApiFetchStub);
			sinon.assert.calledWithExactly(
				localeServiceApiFetchStub,
				`https://test.com/locales-api/v2/dictionary/locales?${expectedQueryParams}`,
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
	});
});
