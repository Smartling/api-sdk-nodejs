interface PriceInformationDto {
    priceMin: number;
    priceMax: number;
    priceMt: number | null;
    priceAit: number | null;
    perPage: boolean;
    currencyCode: string;
}

export { PriceInformationDto };
