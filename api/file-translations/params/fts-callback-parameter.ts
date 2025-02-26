type FtsCallbackUserData = Record<string, unknown>;

enum FtsCallbackMethod {
    GET = "GET",
    POST = "POST"
}

interface FtsCallback {
    url: string;
    httpMethod: FtsCallbackMethod;
    userData?: FtsCallbackUserData
}

export { FtsCallback, FtsCallbackMethod, FtsCallbackUserData };
