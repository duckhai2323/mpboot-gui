import { Repository } from '../src/repository/repository';
import { beforeAll, describe, expect, it } from 'vitest';

const dbPath = '/home/aqaurius6666/codes/mpboot-gui/.test.sqlite';

describe('database', () => {
  let repository: Repository;
  beforeAll(() => {
    repository = Repository.init(dbPath);
  });

  it('repository be defined', () => {
    expect(repository).toBeDefined();
  });
});
