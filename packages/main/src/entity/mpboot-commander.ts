import path from 'path';
import type { SpawnOptions } from './commander';
import { Commander } from './commander';

export class MPBootCommander extends Commander {
  constructor(binary: string, args: string[], spawnOptions?: SpawnOptions) {
    super(binary, args, spawnOptions);
  }

  get sourceFilePath(): string {
    const sourceIndex = this.args.indexOf('-s');
    if (sourceIndex !== -1) {
      return this.args[sourceIndex + 1];
    }
    return '';
  }

  get sourceFileName(): string {
    return path.basename(this.sourceFilePath);
  }

  get generatedTreeFilePath(): string {
    return `${this.sourceFilePath}.treefile`;
  }
}
