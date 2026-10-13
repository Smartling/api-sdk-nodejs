interface TmxParsingErrorDto {
    messages: Array<string>;
    line: number;
    column: number;
}

export { TmxParsingErrorDto };
