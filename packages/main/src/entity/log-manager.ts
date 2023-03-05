import path from 'node:path';
import { Tail } from 'tail';
import { logger } from '../../../common/logger';

export class LogManager {
  private logTailMap: Map<string, Tail>;

  constructor() {
    this.logTailMap = new Map<string, Tail>();
  }

  public isValidLogFile(logFile: string): boolean {
    return path.isAbsolute(logFile);
  }
  public subscribeLog(logFile: string, callback: (data: any) => void): void {
    let currentTail: Tail;
    if (this.logTailMap.has(logFile)) {
      currentTail = this.logTailMap.get(logFile)!;
      currentTail.watch();
    } else {
      currentTail = new Tail(logFile, { follow: true, fromBeginning: true, flushAtEOF: true });
      this.logTailMap.set(logFile, currentTail);
    }
    currentTail.on('line', callback);
  }

  public unsubscribeLog(logFile: string): void {
    if (this.logTailMap.has(logFile)) {
      this.logTailMap.get(logFile)!.unwatch();
      this.logTailMap.delete(logFile);
    } else {
      logger.error(`Log file ${logFile} is not being watched`);
    }
  }
}

export const logManagerInstance = new LogManager();
