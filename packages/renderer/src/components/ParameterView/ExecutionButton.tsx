import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParameter } from '../../hooks/useParameter';
import type { RootState } from '../../redux/store/root';
export const ExecutionButton = () => {
  const parameter = useSelector((state: RootState) => state.parameter);
  const [, , , executeCommand] = useParameter();

  const onRunButtonSubmit: React.FormEventHandler<HTMLButtonElement> = useCallback(
    e => {
      e.preventDefault();
      executeCommand(parameter);
    },
    [parameter, executeCommand],
  );

  return (
    <div>
      <button
        id="run-button"
        onClick={onRunButtonSubmit}
      >
        Run
      </button>
    </div>
  );
};
