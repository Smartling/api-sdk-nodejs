interface EntityAttachmentDto {
    attachmentUid: string;
    name: string;
    description: string | null;
    createdDate: Date;
    createdByUserUid: string;
    localeId?: string | null;
}

export { EntityAttachmentDto };
