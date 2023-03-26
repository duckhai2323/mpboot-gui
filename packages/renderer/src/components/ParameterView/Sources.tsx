import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store/root';
import { getRelativePath as getRelativePathFs } from '../../utils/fs';

export const Sources = () => {
  const { source, multiSources } = useSelector((state: RootState) => state.parameter);

  const { dirPath } = useSelector((state: RootState) => state.workspace);

  const getRelativePath = useCallback(
    (path: string) => {
      return getRelativePathFs(path, dirPath);
    },
    [dirPath],
  );

  return (
    <tr>
      <td>Source file(s)</td>
      <td>
        {multiSources.length > 1 && (
          <div data-tooltip={multiSources.map(e => getRelativePath(e)).join(', ')}>
            {getRelativePath(multiSources[0])} and more {multiSources.length - 1} files
          </div>
        )}
        {multiSources.length === 1 && (
          <div data-tooltip={getRelativePath(multiSources[0])}>
            {getRelativePath(multiSources[0])}
          </div>
        )}
        {multiSources.length === 0 && (
          <div data-tooltip={getRelativePath(source)}>{getRelativePath(source)}</div>
        )}
        {source === '' && multiSources.length === 0 && <div>Not specified</div>}
      </td>
    </tr>
  );
};
