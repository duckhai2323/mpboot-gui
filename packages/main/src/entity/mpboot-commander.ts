import { Commander, SpawnOptions } from "./commander";

export class MPBootCommander extends Commander {

    constructor(binary: string, args: string[], spawnOptions?: SpawnOptions) {
        super(binary, args, spawnOptions);
    }

    get sourceFilePath(): string {
        const sourceIndex = this.args.indexOf('-s');
        if (sourceIndex !== -1) {
            return this.args[sourceIndex + 1];
        }
        return ''
    }

    get sourceFileName(): string {
        return this.sourceFilePath.split('/').pop()!;
    }

    get generatedTreeFilePath(): string {
        return `${this.sourceFilePath}.treefile`;
    }
}