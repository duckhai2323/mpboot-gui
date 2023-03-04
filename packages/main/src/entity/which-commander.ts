import type { SpawnOptions } from './commander';
import { Commander } from './commander';

export class WhichCommander extends Commander {

    constructor(targetBinary : string, spawnOptions?: SpawnOptions) {
        if (process.platform === 'win32') {
            super('where', [targetBinary], spawnOptions);
        }
        super('which', [targetBinary], spawnOptions);
    }

    public async test(): Promise<boolean> {
        return new Promise<boolean>((resolve, _reject) => {
          this.execute((_code) => {
            if (_code !== 0) {
              resolve(false);
            }
            resolve(true);
          }).catch(_e => {
            resolve(false);
          });
        });
      }
}