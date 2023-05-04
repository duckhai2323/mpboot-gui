import _glob from 'glob';
import { promisify } from 'util';
import { is } from '../const';

const _globAsync = promisify(_glob);

export const convertWindowPathToPosixStyle = (path: string) => {
    return path.replace(/\\/g, '/');
};

export const convertPosixPathToWindowStyle = (path: string) => {
    return path.replace(/\//g, '\\');
};


export const globAsync = (pattern: string, options?: _glob.IOptions): Promise<string[]> => {
    if (!is.win) {
        return _globAsync(pattern, options);
    }
    let { cwd } = options ?? {};
    if (cwd) {
        cwd = convertWindowPathToPosixStyle(cwd);
    }
    const posixPattern = convertWindowPathToPosixStyle(pattern);
    return _globAsync(posixPattern, {
        ...options,
        cwd,
    }).then((paths) => {
        return paths.map(convertPosixPathToWindowStyle);
    });
}; 