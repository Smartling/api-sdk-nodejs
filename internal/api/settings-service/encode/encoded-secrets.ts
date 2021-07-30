export default interface EncodedSecrets {
    encodedWith: string;
    value: string;
    [propName: string]: any;
}
