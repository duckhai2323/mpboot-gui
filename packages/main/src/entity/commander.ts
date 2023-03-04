import { spawn } from 'child_process';

import { createWriteStream } from 'fs';
import { writeFile } from 'fs/promises';
import { tmpdir } from 'os';

export interface ExecuteResult {
  logFile: string;
  pid: number;
}

export interface SpawnOptions {
  cwd?: string;
}

export class Commander {
  protected binary: string;
  protected args: string[];
  private spawnOptions?: SpawnOptions;

  constructor(binary: string, args: string[], spawnOptions?: SpawnOptions) {
    this.binary = binary;
    this.args = args;
    this.spawnOptions = spawnOptions;
  }

  public async execute(onFinish: () => void): Promise<ExecuteResult> {
    const logFileName = `${tmpdir()}/log-${this.binary.replaceAll('/', '-')}-${Date.now()}.log`;
    await writeFile(logFileName, '');
    const logStream = createWriteStream(logFileName, { flags: 'a+' });
    const ls = spawn(this.binary, this.args, {
      ...this.spawnOptions,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    if (ls.pid === undefined) {
      ls.kill();
      logStream.end();
      throw new Error('Failed to run command');
    }
    ls.stdout.pipe(logStream);
    ls.stderr.pipe(logStream);

    ls.on('exit', (_code) => {
      logStream.end();
      onFinish();
    });

    return {
      logFile: logFileName,
      pid: ls.pid,
    };
  }
}
