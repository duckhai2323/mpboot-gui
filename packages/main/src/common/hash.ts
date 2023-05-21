import { createHash } from 'crypto';
import { createReadStream } from 'fs';

export const hashFile = (path: string) =>
  new Promise<string>((resolve, reject) => {
    const fd = createReadStream(path);
    const hash = createHash('sha1');
    hash.setEncoding('hex');
    fd.on('end', () => {
      hash.end();
      resolve(hash.read());
    });
    fd.on('error', reject);
    fd.pipe(hash);
  });
