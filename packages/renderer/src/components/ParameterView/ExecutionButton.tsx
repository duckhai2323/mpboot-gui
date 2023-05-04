import type React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store/root';
import { MButton } from '../common/Button';
import { useExecution } from '../../hooks/useExecution';
export const ExecutionButton = () => {
  const parameter = useSelector((state: RootState) => state.parameter);
  const { isRunning, isExecutionHistory } = useSelector((state: RootState) => state.execution);
  const { executeCommand } = useExecution();

  const onRunButtonSubmit: React.FormEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    executeCommand(parameter, isExecutionHistory);
  };

  return (
    <div>
      <MButton
        id="run-button"
        onClick={onRunButtonSubmit}
        disabled={!!isRunning}
      >
        {isExecutionHistory ? 'Re-run' : 'Run'}
      </MButton>
    </div>
  );
};
