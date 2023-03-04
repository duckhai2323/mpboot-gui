export interface Parameter {
    source: string;
}

export const convertParameterToCommandArgs = (parameter: Parameter): string[] => {
    const args = [];

    if (parameter.source) {
        args.push('-s');
        args.push(parameter.source);
    }

    return args;
};