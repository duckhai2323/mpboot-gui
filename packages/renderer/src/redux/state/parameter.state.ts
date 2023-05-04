export const initialParameterState = {
  source: '',
  multiSources: [] as string[],
  treefile: '',
  sequenceType: '',
  extendedParameter: '',
  seed: 0,
};

export type ParameterState = {
  source: string;
  multiSources?: string[];
  treefile: string;
  sequenceType: string;
  extendedParameter: string;
  seed?: number;
};
