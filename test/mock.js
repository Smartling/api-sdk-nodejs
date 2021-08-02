const loggerMock = {
    debug: () => {},
    warn: () => {},
    error: () => {},
    info: () => {}
};

const authMock = {
    getAccessToken: () => "test_access_token",
    getTokenType: () => "test_token_type",
    resetToken: () => {}
};

const responseMock = {
    status: 200,
    text: () => {},
    json: async () => {}
};

module.exports = {
    loggerMock,
    authMock,
    responseMock
};
