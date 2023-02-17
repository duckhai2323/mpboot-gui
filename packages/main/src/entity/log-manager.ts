import { Tail } from 'tail';

export class LogManager {
  private logTailMap: Map<string, Tail>;

  constructor() {
    this.logTailMap = new Map<string, Tail>();
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
    }
  }
}

export const logManagerInstance = new LogManager();
