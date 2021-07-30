class BaseParameters {
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

module.exports = BaseParameters;
