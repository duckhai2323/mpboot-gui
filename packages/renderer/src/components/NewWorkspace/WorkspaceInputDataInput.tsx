import React, { useCallback, useState } from 'react';
import { useElectron } from '../../hooks/useElectron';
import { MButton } from '../common/Button';
import type { NewWorkspaceInputData } from './NewWorkspace';
import './workspace.css';

export const WorkspaceInputDataInput = () => {
  const [inputData, setInputData] = useState<NewWorkspaceInputData[]>([]);
  const electron = useElectron();
  const onAddClick = useCallback((current: NewWorkspaceInputData[]) => {
    (async () => {
      const res = await electron.chooseDirectoryOrFile();
      if (res.canceled || !res.paths) return;
      const inputData: NewWorkspaceInputData[] = [];
      const refNameSet = new Set(current.map(inputData => inputData.refName));
      const inputPathSet = new Set(current.map(inputData => inputData.inputPath));
      for (const path of res.paths) {
        if (inputPathSet.has(path)) continue;
        inputPathSet.add(path);

        const basename = electron.basename(path);
        let refName = basename;
        let counter = 0;
        while (refNameSet.has(refName)) {
          counter += 1;
          refName = `${refName}_${counter}`;
        }
        refNameSet.add(refName);
        const inputPath = path;
        const type = (await electron.isDirectory(path)) ? 'directory' : 'file';
        inputData.push({ refName, inputPath, type });
      }
      setInputData([...current, ...inputData].sort((a, b) => a.refName.localeCompare(b.refName)));
    })();
  }, []);

  const onDeleteClick = useCallback((inputData: NewWorkspaceInputData[], i: number) => {
    const current = [...inputData];
    current.splice(i, 1);
    setInputData(current);
  }, []);

  return (
    <div>
      <div>
        <label>Input data</label>
        <MButton onClick={_e => onAddClick(inputData)}>Add</MButton>
      </div>
      <div>
        {inputData.length > 0 &&
          inputData.map((e, i) => {
            return (
              <div>
                <span>{e.refName}</span>
                <span>{e.inputPath}</span>
                <input
                  type="hidden"
                  name="inputData"
                  value={JSON.stringify(e)}
                />
                <MButton onClick={_e => onDeleteClick(inputData, i)}>Remove</MButton>
              </div>
            );
          })}
      </div>
    </div>
  );
};
