import AuditLog from "./audit-log";

interface Response {
    totalCount: number;
    items: Array<AuditLog>;
}

export default Response;
