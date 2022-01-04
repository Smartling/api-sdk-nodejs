/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export class BaseParameters {
    protected parameters: Record<string, any>;

    constructor(parameters: Record<string, any> = {}) {
        this.parameters = parameters;
    }

    set(key: string, value: any): void {
        this.parameters[key] = value;
    }

    export(): Record<string, any> {
        return this.parameters;
    }
}
