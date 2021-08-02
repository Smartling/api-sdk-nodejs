export const loggerMock = {
    debug: () => {},
    warn: () => {},
    error: () => {},
    info: () => {}
};

export const authMock = {
    getAccessToken: () => "test_access_token",
    getTokenType: () => "test_token_type",
    resetToken: () => {}
};

export const responseMock = {
    status: 200,
    text: () => {},
    json: async () => {},
    headers: {}
};
