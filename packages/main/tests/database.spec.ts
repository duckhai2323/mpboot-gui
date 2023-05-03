import type { IDatabase} from '../src/repository/database';
import { Sqlite3Database } from '../src/repository/database';
import { beforeAll, describe, expect, it } from 'vitest';

const dbPath = '/home/aqaurius6666/codes/mpboot-gui/.test.sqlite';

describe('database', () => {
  let db: IDatabase;
  beforeAll(() => {
    db = new Sqlite3Database(dbPath);
  });

  it('database be defined', () => {
    expect(db).toBeDefined();
  });

  it('implement interface', () => {
    expect(db.run).toBeDefined();
    expect(db.getMany).toBeDefined();
    expect(db.getOne).toBeDefined();
    expect(db.serialize).toBeDefined();
  });

  it('getOne return promise', async () => {
    const res = await db.getOne('select 1 where 1 = ?', [1]);
    expect(res).toEqual({ '1': 1 });
  });
  it('getMany return promise', async () => {
    const res = await db.getMany('select type from sqlite_master where type = ?', ['table']);
    expect(res.length).greaterThanOrEqual(0);
  });
  it('run return promise', async () => {
    const res = await db.run('select type from sqlite_master where type = ?', ['table']);
    expect(res).toBeUndefined();
  });
  it('serialize return promise', async () => {
    const res = await db.serialize(async db => {
      const res = await db.getOne('select 1');
      expect(res).toEqual({ '1': 1 });
      const res2 = await db.getOne('select 1');
      expect(res2).toEqual({ '1': 1 });
    });
    expect(res).toBeUndefined();
  });
});
