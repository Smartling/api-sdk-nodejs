interface AccessTokenDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
    tokenType: string;
}

export { AccessTokenDto };
