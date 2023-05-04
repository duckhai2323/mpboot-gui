import { useSelector } from 'react-redux';
import { useParameter } from '../../hooks/useParameter';
import type { RootState } from '../../redux/store/root';

export const ExtendedParameter = () => {
  const { setParameter } = useParameter();
  const { extendedParameter } = useSelector((state: RootState) => state.parameter);
  const { isExecutionHistory } = useSelector((state: RootState) => state.execution);

  const onExtendedParameterInputDidChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setParameter({
      extendedParameter: e.target.value || '',
    });
  };

  return (
    <tr>
      <td>Extended parameter</td>
      <td>
        <input
          onChange={onExtendedParameterInputDidChange}
          type="text"
          key={isExecutionHistory ? extendedParameter : 'editable'}
          defaultValue={isExecutionHistory ? extendedParameter : ''}
        ></input>
      </td>
    </tr>
  );
};
