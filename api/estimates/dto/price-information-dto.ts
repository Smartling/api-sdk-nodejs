interface PriceInformationDto {
    priceMin: number;
    priceMax: number;
    priceMt: number | null;
    priceAit: number | null;
    perPage: boolean;
    // Null for the ZERO_PRICE sentinel (e.g. a tier with no computed price) - confirmed via
    // the real PriceInformationDTO.ZERO_PRICE constant, which has a null currencyCode.
    currencyCode: string | null;
}

export { PriceInformationDto };
