import { useCallback, useState } from 'react';
import { useElectron } from '../../hooks/useElectron';
import type { NewWorkspaceInputData } from './NewWorkspace';
import classNames from 'classnames/bind';
import styles from './NewWorkspace.module.scss';

const cx = classNames.bind(styles);

export const WorkspaceInputDataInput = () => {
  const [inputData, setInputData] = useState<NewWorkspaceInputData[]>([]);
  const electron = useElectron();

  // const onAddClick = useCallback((current: NewWorkspaceInputData[]) => {
  //   (async () => {
  //     const res = await electron.chooseDirectoryOrFile();
  //     if (res.canceled || !res.paths) return;
  //     const inputData: NewWorkspaceInputData[] = [];
  //     const refNameSet = new Set(current.map(inputData => inputData.refName));
  //     const inputPathSet = new Set(current.map(inputData => inputData.inputPath));
  //     for (const path of res.paths) {
  //       if (inputPathSet.has(path)) continue;
  //       inputPathSet.add(path);

  //       const basename = electron.basename(path);
  //       let refName = basename;
  //       let counter = 0;
  //       while (refNameSet.has(refName)) {
  //         counter += 1;
  //         refName = `${refName}_${counter}`;
  //       }
  //       refNameSet.add(refName);
  //       const inputPath = path;
  //       const type = (await electron.isDirectory(path)) ? 'directory' : 'file';
  //       inputData.push({ refName, inputPath, type });
  //     }
  //     setInputData([...current, ...inputData].sort((a, b) => a.refName.localeCompare(b.refName)));
  //   })();
  // }, []);

  const onAddClickOnlyFile = useCallback((current: NewWorkspaceInputData[]) => {
    (async () => {
      const res = await electron.chooseDirectoryOrFile();
      if (res.canceled || !res.paths) return;
      const inputData: NewWorkspaceInputData[] = [];
      const inputPathSet = new Set(current.map(inputData => inputData.inputPath));
      if(inputPathSet.has(res.paths[0])){
        return;
      }
      const type = (await electron.isDirectory(res.paths[0])) ? 'directory' : 'file';
      const basename = electron.basename(res.paths[0]);
      inputData.push({refName:basename,inputPath:res.paths[0],type});
      setInputData(inputData);
    })();
  }, []);

  // const onDeleteClick = useCallback((inputData: NewWorkspaceInputData[], i: number) => {
  //   const current = [...inputData];
  //   current.splice(i, 1);
  //   setInputData(current);
  // }, []);

  return (
    <div className={cx('workspace-input')}>
      <label>Input Data</label>
      <div className={cx('form-input')}>
        <input
        placeholder='example.phy'
        required
        value={inputData.length>0?inputData[0].inputPath:''}
        />
        <input type="hidden" name="inputData" value={JSON.stringify(inputData[0])}
                />
      <button className={cx('button')} onClick={_e => {onAddClickOnlyFile(inputData);}}>{inputData.length ? 'Edit' : 'Add'}</button>
      </div>
    </div>
  );
};
