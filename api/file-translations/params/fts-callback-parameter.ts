type FtsCallbackUserData = Record<string, unknown>;

enum FtsCallbackMethod {
    GET = "GET",
    POST = "POST"
}

interface FtsCallback {
    url: string;
    httpMethod: FtsCallbackMethod;
    userData?: FtsCallbackUserData | string
}

export { FtsCallback, FtsCallbackMethod, FtsCallbackUserData };
