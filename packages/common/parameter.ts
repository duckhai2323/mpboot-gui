export interface Parameter {
  source?: string;
  multiSources?: string[];
  treefile?: string;
  sequenceType?: string;
}

export const convertParameterToCommandArgs = (parameter: Parameter): string[] => {
  const args = [];

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

  return args;
};
