import { describe, expect, it } from 'vitest';
import { MPBootCommander } from '../src/entity/mpboot-commander';
import { versionRegexPattern } from '../src/common/regex';

describe('mpboot-commander', () => {
  it('get version of mpboot', async () => {
    const version = await MPBootCommander.getVersion('mpboot');
    expect(version).toBeDefined();
    const regex = new RegExp(versionRegexPattern);
    expect(regex.test(version)).toBeTruthy();
  });
  it('get version of not found binary', async () => {
    const version = await MPBootCommander.getVersion('mpboot-2');
    expect(version).toBeDefined();
    expect(version).eq('unknown');
  });
  it('get version of unknown', async () => {
    const version = await MPBootCommander.getVersion('node');
    expect(version).toBeDefined();
    expect(version).eq('unknown');
  });
});
