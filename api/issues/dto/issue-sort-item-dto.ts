import { Order } from "../../parameters/order";
import { IssueSortField } from "../enums/issue-sort-field";

export interface IssueSortItemDto {
    direction: Order;
    fieldName: IssueSortField;
}
