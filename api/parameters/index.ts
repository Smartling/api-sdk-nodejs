export class BaseParameters {
    protected parameters: {
        [index: string]: any
    };

    constructor(parameters: object = {}) {
        this.parameters = parameters;
    }

    set(key: string, value: any) {
        this.parameters[key] = value;
    }

    export() {
        return this.parameters;
    }
}
