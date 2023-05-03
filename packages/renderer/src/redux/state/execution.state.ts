export const initialExecutionState: ExecutionState = {
  commandId: '',
  logFile: '',
  isExecutionHistory: false,
  sequenceNumber: undefined,
};
export type ExecutionState = {
  commandId: string;
  logFile: string;
  isExecutionHistory: boolean;
  sequenceNumber?: number;
};
