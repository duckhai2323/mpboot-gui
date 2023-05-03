export interface Parameter {
  source?: string;
  multiSources?: string[];
  treefile?: string;
  sequenceType?: string;
  seed?: number;
  isExecutionHistory?: boolean;
}

export const convertParameterToCommandArgs = (parameter: Parameter): string[] => {
  const args = [] as string[];

  if (parameter.source) {
    args.push('-s');
    args.push(parameter.source);
  }
  if (parameter.treefile) {
    args.push(parameter.treefile);
  }
  if (parameter.sequenceType) {
    args.push('-st');
    args.push(parameter.sequenceType);
  }
  if (parameter.seed) {
    args.push('-seed');
    args.push(parameter.seed.toString());
  }

  return args;
};

export const convertCommandToParameter = (command: string): Parameter => {
  const parameter = {} as Parameter;

  const commandParts = command.split(' ');
  const sourceIndex = commandParts.indexOf('-s');
  if (sourceIndex !== -1) {
    parameter.source = commandParts[sourceIndex + 1];
  }
  const sequenceTypeIndex = commandParts.indexOf('-st');
  if (sequenceTypeIndex !== -1) {
    parameter.sequenceType = commandParts[sequenceTypeIndex + 1];
  }

  const treefile = commandParts.find(part => part.includes('.treefile'));
  if (treefile) {
    parameter.treefile = treefile;
  }
  return parameter;
};
