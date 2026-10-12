// Lowercase values are intentional: the REST API's enum literally expects "on"/"off",
// unlike every other enum in this domain (which are upper-case GraphQL enum values).
export enum EscapeSmpUnicodeParserDirective {
    ON = "on",
    OFF = "off"
}
