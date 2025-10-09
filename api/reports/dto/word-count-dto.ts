interface WordCountDto {
    accountUid: string;
    accountName: string;
    projectId: string;
    projectName: string;
    targetLocaleId: string;
    targetLocale: string;
    jobUid: string;
    jobName: string;
    jobReferenceNumber: string;
    jobNumber: string;
    translationResourceUid: string;
    translationResourceName: string;
    agencyUid: string;
    agencyName: string;
    workflowStepType: string;
    workflowStepUid: string;
    workflowStepName: string;
    fuzzyProfileName: string;
    fuzzyTier: string;
    wordCount: number;
    characterCount: number;
    weightedWordCount: number;
}

export { WordCountDto };
