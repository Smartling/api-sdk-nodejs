interface DownloadAttachmentOptions {
    /**
     * Maximum accepted attachment size in bytes, a non-negative finite number.
     *
     * The limit is checked twice: against the Content-Length header when the response has one
     * (the attachments service usually does not, it streams chunked), and otherwise while the
     * body is read, which stops as soon as it grows past the limit. Either way the download is
     * rejected with a SmartlingException.
     *
     * Rejecting does not release the HTTP connection straight away: it stays open until the
     * server finishes or closes it.
     */
    maxBytes?: number;
}

export { DownloadAttachmentOptions };
