import type React from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParameter } from '../../hooks/useParameter';
import type { RootState } from '../../redux/store/root';

export const SequenceType = () => {
  const { sequenceType: inputDataType } = useSelector((state: RootState) => state.parameter);
  const [, , , , setParameter] = useParameter();

  const onChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '') {
      setParameter({
        sequenceType: '',
      });
      return;
    }
    setParameter({
      sequenceType: e.target.value,
    });
  }, []);

  return (
    <tr>
      <td>Sequence data type</td>
      <td>
        <select
          defaultValue={inputDataType}
          onChange={onChange}
        >
          <option value="">Auto detect</option>
          <option value="BIN">BIN</option>
          <option value="DNA">DNA</option>
          <option value="AA">AA</option>
          <option value="CODON">CODON</option>
          <option value="MORPH">MORPH</option>
        </select>
      </td>
    </tr>
  );
};
