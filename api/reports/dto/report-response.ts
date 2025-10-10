interface ReportResponse<T> {
    resultsTruncated: boolean;
    items: Array<T>;
}

export { ReportResponse };
