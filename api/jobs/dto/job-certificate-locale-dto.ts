import { JobCertificateArtifactDto } from "./job-certificate-artifact-dto";
import { JobCertificateStatus } from "../params/job-certificate-status";

interface JobCertificateLocaleDto {
    localeId: string;
    localeDescription: string | null;
    status: JobCertificateStatus;
    error: string | null;
    certificate: JobCertificateArtifactDto;
    bundle: JobCertificateArtifactDto;
    createdDate: Date;
    completedDate: Date | null;
}

export { JobCertificateLocaleDto };
