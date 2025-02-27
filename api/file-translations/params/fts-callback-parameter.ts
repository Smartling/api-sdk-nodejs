import { FtsCallbackMethod } from "./fts-callback-method";

interface FtsCallback {
    url: string;
    httpMethod: FtsCallbackMethod;
    userData?: string
}

export { FtsCallback };
