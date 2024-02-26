import { BaseLocaleDto } from "../../dto/base-locale-dto";

interface LocaleDto extends BaseLocaleDto {
    enabled: boolean;
}

export { LocaleDto };
