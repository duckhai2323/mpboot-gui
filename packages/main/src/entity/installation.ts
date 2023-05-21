import { createWriteStream } from 'fs';
import type { OSType } from '../../../common/stuff';
import type { MPBootSource, MPBootVersion } from '../common/type';
import { WritableStream } from 'stream/web';
import type { OnDownloadProgress } from '../../../common/installation';
import { Commander } from './commander';
import { readdir } from 'fs/promises';
import { githubFetch } from '../services/github';
import { mkdirp } from '../common/fs';
import { globAsync } from '../common/glob';
import { join } from 'path';

export class Installation {
  static async listVersions(
    source: MPBootSource,
    binaryDirectory: string,
  ): Promise<MPBootVersion[]> {
    let versions = [];
    if (source.gitProvider === 'github') {
      const res = await githubFetch(
        `https://api.github.com/repos/${source.gitOwner}/${source.gitRepoName}/releases`,
      );
      const json = await res.json();

      versions = json.map((e: any) => {
        return {
          versionId: e.id,
          versionName: e.name,
        };
      });
    } else {
      throw new Error(`git provider ${source.gitProvider} not supported`);
    }
    const inAppInstalled = await globAsync(join(binaryDirectory, '**', 'mpboot*'));
    versions = versions.map((e: MPBootVersion) => {
      const installed = inAppInstalled.find(i => {
        return i.includes(e.versionName);
      });
      if (installed) {
        return {
          ...e,
          binaryPath: installed,
        };
      }
      return e;
    });
    return versions;
  }

  static async getAssetUrl(
    source: MPBootSource,
    version: MPBootVersion,
    os: OSType,
  ): Promise<string> {
    if (source.gitProvider === 'github') {
      const url = `https://api.github.com/repos/${source.gitOwner}/${source.gitRepoName}/releases/${version.versionId}/assets`;
      const res = await (await githubFetch(url)).json();
      const asset = res
        .map((e: any) => {
          return {
            name: e.name,
            browser_download_url: e.browser_download_url,
          };
        })
        .find((e: any) => {
          return (
            e.name.includes(os) &&
            e.name.includes('mpboot') &&
            e.name.includes('sse') &&
            e.name.includes(version.versionName)
          );
        });

      if (!asset) {
        throw new Error(`asset ${version.versionName} ${os} not found`);
      }
      return asset.browser_download_url;
    } else {
      throw new Error(`git provider ${source.gitProvider} not supported`);
    }
  }

  static async downloadAsset(
    url: string,
    dest: string,
    onProgress: OnDownloadProgress,
  ): Promise<void> {
    const res = await githubFetch(url);
    if (!res.ok) {
      throw new Error(`download asset ${url} failed`);
    }

    if (res.headers.get('content-disposition')?.includes('attachment') === false) {
      throw new Error(`download asset ${url} failed: no attachment`);
    }

    await new Promise<void>((resolve, reject) => {
      if (!res.body) {
        throw new Error(`download asset ${url} failed: no body`);
      }
      const fileStream = createWriteStream(dest, { flags: 'wx', encoding: 'binary' });
      const total = Number(res.headers.get('content-length'));
      let loaded = 0;
      const stream = new WritableStream({
        write(chunk) {
          loaded += chunk.length;
          onProgress({
            loadedSize: loaded,
            totalSize: total,
            progress: loaded / total,
          });
          fileStream.write(chunk);
          return;
        },
        start() {
          return;
        },
        close() {
          fileStream.end();
          resolve();
          return;
        },
        abort() {
          fileStream.end();
          fileStream.destroy();
          reject('download asset failed');
          return;
        },
      });
      res.body.pipeTo(stream);
    });
  }

  static async extractAsset(assetPath: string, dest: string): Promise<string> {
    await mkdirp(dest);
    const extractCommand = new Commander('unzip', [assetPath, '-d', dest]);
    await extractCommand.executeInline();
    const files = await readdir(dest);
    if (files.length >= 0) {
      return `${dest}/${files[0]}`;
    }
    throw new Error(`extract asset ${assetPath} failed`);
  }
}
