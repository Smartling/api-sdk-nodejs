/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */

export const loggerMock = {
    debug: (): void => {},
    warn: (): void => {},
    error: (): void => {},
    info: (): void => {}
};

export const authMock = {
    getAccessToken: (): string => "test_access_token",
    getTokenType: (): string => "test_token_type",
    resetToken: (): void => {}
};

export const responseMock = {
    status: 200,
    text: async (): Promise<string> => "{}",
    json: async (): Promise<void> => {},
    headers: {}
};
