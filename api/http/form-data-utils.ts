import FormData from "form-data";

function fixContentTypeHeaderCase(form: FormData): Record<string, unknown> {
    const headers = form.getHeaders();

    headers["Content-Type"] = headers["content-type"];
    // eslint-disable-next-line fp/no-delete
    delete headers["content-type"];
    return headers;
}

export { fixContentTypeHeaderCase };
