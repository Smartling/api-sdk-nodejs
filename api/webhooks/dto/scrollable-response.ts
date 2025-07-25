interface ScrollableResponse<T> {
    items: Array<T>;
    hasMore: boolean;
    scrollId: string | null;
}

export { ScrollableResponse };
