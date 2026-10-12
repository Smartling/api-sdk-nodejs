import { BaseParameters } from "../../parameters/index";
import { ExtendedExportMetadataType } from "./extended-export-metadata-type";

export class BulkExportTmStringsParameters extends BaseParameters {
    setSearchUid(searchUid: string): BulkExportTmStringsParameters {
        this.set("searchUid", searchUid);

        return this;
    }

    setExtendedMetadata(extendedMetadata: boolean): BulkExportTmStringsParameters {
        this.set("extendedMetadata", extendedMetadata);

        return this;
    }

    setExtendedMetadataType(
        extendedMetadataType: ExtendedExportMetadataType
    ): BulkExportTmStringsParameters {
        this.set("extendedMetadataType", extendedMetadataType);

        return this;
    }

    setIncludeAllVariants(includeAllVariants: boolean): BulkExportTmStringsParameters {
        this.set("includeAllVariants", includeAllVariants);

        return this;
    }
}
