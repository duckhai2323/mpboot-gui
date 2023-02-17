export const IPC_EVENTS = {
  SUBSCRIBE_LOG_CHANNEL: 'subscribe-log',
  LOG_CHANNEL: (logFile: string) => `log-of-${logFile}`,
  GENERATE_LOG_CHANNEL: 'generate-log',
};
