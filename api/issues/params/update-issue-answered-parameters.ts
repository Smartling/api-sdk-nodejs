import { BaseParameters } from "../../parameters";

export class UpdateIssueAnsweredParameters extends BaseParameters {
    setAnswered(answered: boolean): UpdateIssueAnsweredParameters {
        this.set("answered", answered);
        return this;
    }
}
