import FormData from "form-data";

function fixContentTypeHeaderCase(form: FormData): Record<string, unknown> {
    const headers = form.getHeaders();

    headers["Content-Type"] = headers["content-type"];
    // eslint-disable-next-line fp/no-delete
    delete headers["content-type"];
    return headers;
}

// form-data passes booleans through to the request stream as-is, which crashes asynchronously
// with ERR_INVALID_ARG_TYPE that no caller can catch.
function appendToFormData(
    form: FormData,
    key: string,
    value: unknown,
    options?: FormData.AppendOptions | string
): void {
    form.append(key, typeof value === "boolean" ? String(value) : value, options);
}

export { fixContentTypeHeaderCase, appendToFormData };
