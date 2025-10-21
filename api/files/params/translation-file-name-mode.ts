export enum TranslationFileNameMode {
    /**
     * Full original file path is used
     */
    UNCHANGED = "unchanged",

    /**
     * Remove all except the last path segment.
     * e.g. /en/strings/file.properties becomes file.properties
     */
    TRIM_LEADING = "trim_leading",

    /**
     * Adds a locale folder to the file path directly before the filename.
     * e.g. /strings/file.properties becomes /strings/es-ES/file.properties
     */
    LOCALE_LAST = "locale_last"
}
