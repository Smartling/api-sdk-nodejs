import { BaseParameters } from "../../parameters/index";
import { FallbackLocaleDto } from "../dto/fallback-locale-dto";

export class CreateGlossaryParameters extends BaseParameters {
    setGlossaryName(glossaryName: string): CreateGlossaryParameters {
        this.set("glossaryName", glossaryName);

        return this;
    }

    setDescription(description: string): CreateGlossaryParameters {
        this.set("description", description);

        return this;
    }

    setVerificationMode(verificationMode: boolean): CreateGlossaryParameters {
        this.set("verificationMode", verificationMode);

        return this;
    }

    setLocaleIds(localeIds: Array<string>): CreateGlossaryParameters {
        this.set("localeIds", localeIds);

        return this;
    }

    setFallbackLocales(fallbackLocales: Array<FallbackLocaleDto>): CreateGlossaryParameters {
        this.set("fallbackLocales", fallbackLocales);

        return this;
    }

    setMtOptimized(mtOptimized: boolean): CreateGlossaryParameters {
        this.set("mtOptimized", mtOptimized);

        return this;
    }
}
