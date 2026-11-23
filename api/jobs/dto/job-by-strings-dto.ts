import { HashcodesByLocaleDto } from "./hashcodes-by-locale-dto";

interface JobByStringsDto {
    translationJobUid: string;
    jobName: string;
    dueDate: Date | null;
    hashcodesByLocale: Array<HashcodesByLocaleDto>;
}

export { JobByStringsDto };
