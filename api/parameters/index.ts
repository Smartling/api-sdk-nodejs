export class BaseParameters {
    protected parameters: {
        [index: string]: any
    };

    constructor(parameters = {}) {
        this.parameters = parameters;
    }

    set(key, value) {
        this.parameters[key] = value;
    }

    export() {
        return this.parameters;
    }
}
