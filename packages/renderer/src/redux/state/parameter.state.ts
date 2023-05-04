export const initialParameterState = {
  source: '',
  multiSources: [] as string[],
  treefile: '',
  sequenceType: '',
  seed: 0,
};

export type ParameterState = {
  source: string;
  multiSources?: string[];
  treefile: string;
  sequenceType: string;
  seed?: number;
};
