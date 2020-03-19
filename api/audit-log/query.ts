class Query {
    q: string;
    offset?: number = 0;
    limit?: number = 10;
    startTime?: string = "now()";
    endTime?: string = "now() - 30d";
    sort?: string = "time:desc";
    [k: string]: any;

    constructor(query: string) {
        this.q = query;
    }
}

export default Query;
