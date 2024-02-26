import { BaseLocaleDto } from "../../dto/base-locale-dto";
import { CountryDto } from "./country-dto";
import { SmartlingLanguageDto } from "./smartling-language-dto";

interface SmartlingLocaleDto extends BaseLocaleDto {
    mtSupported: boolean;
    country: CountryDto;
    language: SmartlingLanguageDto;
}

export { SmartlingLocaleDto };
