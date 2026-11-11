interface DownloadAttachmentOptions {
    /**
     * Maximum accepted attachment size in bytes. When the response's Content-Length header
     * exceeds it, the download is rejected with a SmartlingException before the body is read.
     */
    maxBytes?: number;
}

export { DownloadAttachmentOptions };
