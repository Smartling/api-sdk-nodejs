import { EntityAttachmentDto } from "./entity-attachment-dto";

interface LinkedEntityAttachmentDto extends EntityAttachmentDto {
    canDelete: boolean;
}

export { LinkedEntityAttachmentDto };
