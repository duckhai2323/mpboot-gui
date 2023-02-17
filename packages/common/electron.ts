export interface CustomEventEmitter {
  on: (event: string, callback: (data: any) => void) => void;
  unregister: () => void;
}

export interface ExposedElectron {
  subscribeLog: (logFile: string) => CustomEventEmitter;
  generateLog: () => Promise<string>;
}

export const unimplementedExposedElectron = {} as ExposedElectron;
