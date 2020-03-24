interface Response<T> {
    totalCount: number;
    items: Array<T>;
}

export default Response;
