export interface TranslationImportErrorDto {
    importKey: string;
    stringHashcode: string;
    fileUri: string;
    messages: string[];
}

export interface ImportedFileDto {
    wordCount: number;
    stringCount: number;
    translationImportErrors: TranslationImportErrorDto[];
}
