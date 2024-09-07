import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store/root';
import { useExecution } from '../../hooks/useExecution';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

export const ExecutionHistoryIterator = () => {
  const { sequenceNumber, isExecutionHistory } = useSelector((state: RootState) => state.execution);

  const { loadExecutionHistory } = useExecution();
  if (!isExecutionHistory || sequenceNumber === undefined) return <></>;
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '35px' }}>
      <span style={{ fontSize: '18px' }}>Execution</span>
      <tr className="execution-history">
        <FontAwesomeIcon
          icon={faCaretLeft}
          // disabled={!canBackward}
          onClick={() => loadExecutionHistory(sequenceNumber, 'previous')}
        />
        <div>{sequenceNumber}</div>
        <FontAwesomeIcon
          icon={faCaretRight}
          // disabled={!canForward}
          onClick={() => loadExecutionHistory(sequenceNumber, 'next')}
        />
      </tr>
    </div>
  );
};
