import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store/root';
import { MButton } from '../common/Button';
import { useExecution } from '../../hooks/useExecution';

export const ExecutionHistoryIterator = () => {
  const { sequenceNumber, canBackward, canForward, isExecutionHistory } = useSelector(
    (state: RootState) => state.execution,
  );

  const { loadExecutionHistory } = useExecution();
  if (!isExecutionHistory || sequenceNumber === undefined) return <></>;
  return (
    <tr>
      <MButton
        disabled={!canBackward}
        onClick={() => loadExecutionHistory(sequenceNumber, 'previous')}
      >
        Backward
      </MButton>
      <div>{sequenceNumber}</div>
      <MButton
        disabled={!canForward}
        onClick={() => loadExecutionHistory(sequenceNumber, 'next')}
      >
        Forward
      </MButton>
    </tr>
  );
};
