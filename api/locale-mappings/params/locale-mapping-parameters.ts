import { BaseParameters } from "../../parameters/index";

export class LocaleMappingParameters extends BaseParameters {
    setExternalLocaleId(externalLocaleId: string): LocaleMappingParameters {
        this.set("externalLocaleId", externalLocaleId);

        return this;
    }

    setExternalLocaleDescription(externalLocaleDescription: string): LocaleMappingParameters {
        this.set("externalLocaleDescription", externalLocaleDescription);

        return this;
    }

    setExternalLocaleMetadata(
        externalLocaleMetadata: Record<string, unknown> | null
    ): LocaleMappingParameters {
        this.set("externalLocaleMetadata", externalLocaleMetadata);

        return this;
    }

    setSmartlingLocaleId(smartlingLocaleId: string): LocaleMappingParameters {
        this.set("smartlingLocaleId", smartlingLocaleId);

        return this;
    }
}
