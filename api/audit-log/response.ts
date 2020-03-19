import AuditLog from "./auditLog";

interface Response {
    totalCount: number;
    items: Array<AuditLog>;
}

export default Response;
