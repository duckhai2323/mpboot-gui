export const initialParameterState = {
  source: '',
  multiSources: [] as string[],
  treefile: '',
  sequenceType: '',
  seed: 0,
  isExecutionHistory: false,
};

export type ParameterState = {
  source: string;
  multiSources?: string[];
  treefile: string;
  sequenceType: string;
  seed?: number;
  isExecutionHistory: boolean;
};
