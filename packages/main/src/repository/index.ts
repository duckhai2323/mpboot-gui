import { dbPath } from '../electron-const';
import { Repository } from './repository';

export const repository = Repository.init(dbPath);
