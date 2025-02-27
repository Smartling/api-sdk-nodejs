type FtsCallbackUserData = Record<string, unknown>;

enum FtsCallbackMethod {
    // Other HTTP methods are not supported by API for now
    POST = "POST"
}

interface FtsCallback {
    url: string;
    httpMethod: FtsCallbackMethod;
    userData?: FtsCallbackUserData | string
}

export { FtsCallback, FtsCallbackMethod, FtsCallbackUserData };
