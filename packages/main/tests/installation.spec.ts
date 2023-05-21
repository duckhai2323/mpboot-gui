import { describe, expect, it } from 'vitest';
import { Installation } from '../src/entity/installation';
import type { OSType } from '../../common/stuff';
import { stat } from 'fs/promises';
import { logger } from '../../common/logger';

const testSource = {
  gitProvider: 'github',
  gitOwner: 'aqaurius6666',
  gitRepoName: 'mpboot',
};
const testVersion = {
  versionId: '101688906',
  versionName: 'v0.0.1',
};
describe('installation', () => {
  it('list versions', async () => {
    const versions = await Installation.listVersions(
      testSource,
      '/home/aqaurius6666/.config/MpbootGUI/binary',
    );
    expect(versions).toBeDefined();
    expect(versions.length).toBeGreaterThan(0);
    logger.debug('versions', versions);
  });

  [
    'ubuntu',
    // "windows",
    // "macos"
  ].map(os => {
    it(`get asset url for ${os}`, async () => {
      const url = await Installation.getAssetUrl(testSource, testVersion, os as OSType);
      expect(url).toBeDefined();
      expect(url).toContain('mpboot');
      expect(url).toContain(os);
    });
  });

  it('download asset', async () => {
    const url = await Installation.getAssetUrl(testSource, testVersion, 'ubuntu');
    const zipDestPath = `/tmp/test-mpboot-${new Date().getTime()}`;
    await Installation.downloadAsset(url, zipDestPath, event => {
      expect(event.progress).toBeGreaterThanOrEqual(0);
      expect(event.progress).toBeLessThanOrEqual(1);
    });
    let statInfo = await stat(zipDestPath);
    expect(statInfo.size).toBeGreaterThan(0);

    const dest2 = `/tmp/test-mpboot-${new Date().getTime()}-extracted`;
    const binaryPath = await Installation.extractAsset(zipDestPath, dest2);
    statInfo = await stat(dest2);
    expect(statInfo.size).toBeGreaterThan(0);
    expect(binaryPath).toBeDefined();
  });
});
