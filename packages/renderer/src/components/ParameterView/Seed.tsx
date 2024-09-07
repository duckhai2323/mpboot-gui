import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store/root';
import { useCallback } from 'react';
import { useParameter } from '../../hooks/useParameter';

export const Seed = () => {
  const { seed } = useSelector((state: RootState) => state.parameter);
  const { isExecutionHistory } = useSelector((state: RootState) => state.execution);

  const { setParameter } = useParameter();
  const onSeedDidChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setParameter({
        seed: undefined,
      });
      return;
    }
    setParameter({
      seed: Number.parseInt(e.target.value),
    });
  }, []);
  return (
    <tr className="parameter-item">
      <td className='parameter-item-title'>Seed</td>
      <td className="parameter-item-value">
        <input
          type="text"
          id="seed-input"
          key={isExecutionHistory ? seed : 'editable'}
          readOnly={isExecutionHistory}
          defaultValue={isExecutionHistory ? seed : ''}
          onChange={onSeedDidChange}
        />
      </td>
    </tr>
  );
};
