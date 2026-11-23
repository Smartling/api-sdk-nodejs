import { ActionStatus } from "./action-status";

interface ActionStateDto {
    action: string;
    status: ActionStatus;
    lastError: string | null;
}

export { ActionStateDto };
