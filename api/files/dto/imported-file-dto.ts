interface TranslationImportErrorDto {
    importKey: string;
    stringHashcode: string;
    fileUri: string;
    messages: string[];
}

interface ImportedFileDto {
    wordCount: number;
    stringCount: number;
    translationImportErrors: TranslationImportErrorDto[];
}

export { TranslationImportErrorDto, ImportedFileDto };
