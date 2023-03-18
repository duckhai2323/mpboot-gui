export const initialParameterState = {
  source: '',
  multiSources: [] as string[],
};

export type ParameterState = {
  source: string;
  multiSources?: string[];
};
