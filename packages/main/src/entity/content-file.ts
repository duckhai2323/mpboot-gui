import { readFile } from 'fs/promises';
import { basename } from 'path';

export class ContentFile {
  public readonly filePath: string;
  public readonly fileName: string;
  private fileContent: string;
  private isLoaded = false;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.fileName = basename(filePath);
    this.fileContent = '';
  }

  private async loadContent(): Promise<void> {
    this.fileContent = await readFile(this.filePath, 'utf-8');
    this.isLoaded = true;
  }

  public async getFileContent(): Promise<string> {
    if (!this.isLoaded) {
      await this.loadContent();
    }
    return this.fileContent;
  }
}
