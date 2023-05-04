import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useElectron } from '../../hooks/useElectron';
import { useParameter } from '../../hooks/useParameter';
import type { RootState } from '../../redux/store/root';
import { getRelativePath } from '../../utils/fs';

export const Treefile = () => {
  const [treefiles, setTreefiles] = useState<string[]>([]);
  const electron = useElectron();
  const { treefile } = useSelector((state: RootState) => state.parameter);
  const { dirPath } = useSelector((state: RootState) => state.workspace);
  const navigate = useNavigate();
  const { setParameter } = useParameter();

  useEffect(() => {
    if (!dirPath) {
      navigate('/dashboard');
      return;
    }
    electron.searchDirectoryTree(dirPath, '**/*.treefile').then(treefiles => {
      setTreefiles(treefiles);
    });
  }, [dirPath]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setParameter({ treefile: '' });
      return;
    }
    setParameter({ treefile: electron.join(dirPath, e.target.value) });
  }, []);

  return (
    <tr>
      <td>Reconstruction treefile</td>
      <td>
        <input
          type="text"
          id="treefile-input"
          key={treefile}
          list="treefile"
          placeholder="Treefile"
          onChange={onChange}
          defaultValue={getRelativePath(treefile, dirPath)}
        />
        <datalist id="treefile">
          {treefiles.map(treefile => {
            return <option value={treefile} />;
          })}
        </datalist>
      </td>
    </tr>
  );
};
