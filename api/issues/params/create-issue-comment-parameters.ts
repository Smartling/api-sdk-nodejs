import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

export class CreateIssueCommentParameters extends BaseParameters {
    setCommentText(commentText: string): CreateIssueCommentParameters {
        if (commentText && commentText.length > 4000) {
            throw new SmartlingException("Comment text length must not exceed 4000 characters");
        }
        this.set("commentText", commentText);
        return this;
    }
}
