export const initialParameterState = {
  source: '',
  multiSources: [] as string[],
  treefile: '',
  sequenceType: '',
};

export type ParameterState = {
  source: string;
  multiSources?: string[];
  treefile: string;
  sequenceType: string;
};
