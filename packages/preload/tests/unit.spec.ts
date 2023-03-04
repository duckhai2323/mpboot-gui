import { expect, test } from 'vitest';
import { exposed } from '../src';

test('versions', async () => {
  expect(exposed).not.toBeUndefined();
});
