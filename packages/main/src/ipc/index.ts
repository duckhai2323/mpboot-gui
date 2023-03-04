import './log.ipc';
import './workspace.ipc';
import './directory-tree.ipc';
import './content-file.ipc';
import './command.ipc';
import { logger } from '../../../common/logger';


process.on('uncaughtException', function (err) {
    logger.error('uncaughtException', err);
});