export const initialLogState = {
  logData: new Array<string>(),
  logFile: '',
};

export type LogState = {
  logData: string[];
  logFile: string;
};
