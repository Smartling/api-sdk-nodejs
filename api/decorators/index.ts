export function IsNotEmpty(
    target: any,
    methodName: string,
    parameterIndex: number
) {
    if (!target?.validations) {
        target.validations = [];
    }

    target.validations.push(`${methodName}:${parameterIndex}:${IsNotEmpty.name}`);
}

function IsNotEmptyValidate(
    methodName: string,
    argumentIndex: number,
    argumentValue: any
) {
    if (argumentValue === '' || argumentValue === null || argumentValue === undefined) {
        throw new Error(`Invalid empty argument at index ${argumentIndex} with "${argumentValue}" value in "${methodName}" method`);
    }
}

export function Validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
    let method = descriptor.value!;

    descriptor.value = function (...args: Array<any>) {
        if (target?.validations?.length) {
            for (const validation of target.validations) {
                const [methodName, argumentIndex, validatorName] = validation.split(":");

                if (method.name === methodName) {
                    switch (validatorName) {
                        case IsNotEmpty.name:
                            const argumentValue = args[argumentIndex];

                            IsNotEmptyValidate(methodName, argumentIndex, argumentValue);

                            break;
                    }
                }
            }
        }

        return method.apply(this, arguments);
    };
}
