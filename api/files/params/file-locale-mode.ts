export enum FileLocaleMode {
    /**
     * Locale code is added to the end of the file path.
     * e.g. /strings/es-ES/file.properties
     */
    LOCALE_IN_PATH = "locale_in_path",

    /**
     * Locale code is added to the end of the file name.
     * e.g. /strings/file_es-ES.properties
     */
    LOCALE_IN_NAME = "locale_in_name",

    /**
     * Locale code is added to both the path and the filename.
     * e.g. /strings/es-ES/file_es-ES.properties
     */
    LOCALE_IN_NAME_AND_PATH = "locale_in_name_and_path"
}
