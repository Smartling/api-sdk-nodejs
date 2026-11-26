export enum ResponseBodyType {
    TEXT = "TEXT",
    ARRAY_BUFFER = "ARRAY_BUFFER",
    RAW_RESPONSE = "RAW_RESPONSE",
    /**
     * The default JSON handling without the date reviver: keys named like a date property
     * ("created", "dueDate", ...) keep the value the server sent instead of becoming a Date.
     * Use it for data that is read and written back unchanged, e.g. settings. As in the default
     * mode, the result is response.data, or true for an empty body or a response without data.
     */
    JSON_WITHOUT_DATES = "JSON_WITHOUT_DATES",
}
