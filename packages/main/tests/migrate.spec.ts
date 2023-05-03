import { Sqlite3Database } from '../src/repository/database';
import { beforeAll, describe, expect, it } from 'vitest';
import { Sqlite3Migrator } from '../src/repository/migrate';
import type { IMigrator } from '../src/repository/migrate';

const dbPath = '/home/aqaurius6666/codes/mpboot-gui/.test.sqlite';

describe('database', () => {
  let migrator: IMigrator;
  beforeAll(() => {
    const db = new Sqlite3Database(dbPath);
    migrator = new Sqlite3Migrator(db);
  });

  it('migrate be defined', () => {
    expect(migrator).toBeDefined();
  });

  it('implement interface', () => {
    expect(migrator.migrate).toBeDefined();
  });

  it('not failed', async () => {
    await migrator.migrate();
  });
});
