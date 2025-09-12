export class StringItemParameters {
    private stringText: string;
    private variant?: string;
    private callbackUrl?: string;
    private callbackMethod?: string;
    private instruction?: string;
    private format?: string;
    private maxLength?: number;

    constructor(stringText: string) {
        this.stringText = stringText;
    }

    public setVariant(variant: string): StringItemParameters {
        this.variant = variant;
        return this;
    }

    public setCallbackUrl(callbackUrl: string): StringItemParameters {
        this.callbackUrl = callbackUrl;
        return this;
    }

    public setCallbackMethod(callbackMethod: string): StringItemParameters {
        this.callbackMethod = callbackMethod;
        return this;
    }

    public setInstruction(instruction: string): StringItemParameters {
        this.instruction = instruction;
        return this;
    }

    public setFormat(format: string): StringItemParameters {
        this.format = format;
        return this;
    }

    public setMaxLength(maxLength: number): StringItemParameters {
        this.maxLength = maxLength;
        return this;
    }
}
