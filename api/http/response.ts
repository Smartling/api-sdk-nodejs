interface HTTPResponse<T> {
    totalCount: number;
    items: Array<T>;
}

export { HTTPResponse };
