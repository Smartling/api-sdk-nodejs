import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

export class EditIssueCommentParameters extends BaseParameters {
    setCommentText(commentText: string): EditIssueCommentParameters {
        if (commentText && commentText.length > 4000) {
            throw new SmartlingException("Comment text length must not exceed 4000 characters");
        }
        this.set("commentText", commentText);
        return this;
    }
}
