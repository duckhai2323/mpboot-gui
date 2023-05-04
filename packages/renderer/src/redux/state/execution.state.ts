export const initialExecutionState: ExecutionState = {
  commandId: '',
  logFile: '',
  isExecutionHistory: false,
  sequenceNumber: undefined,
  canForward: false,
  canBackward: false,
  isRunning: false,
};

export type ExecutionState = {
  commandId: string;
  logFile: string;
  isExecutionHistory: boolean;
  sequenceNumber?: number;
  canForward: boolean;
  canBackward: boolean;
  isRunning: boolean;
};
