import type React from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParameter } from '../../hooks/useParameter';
import type { RootState } from '../../redux/store/root';

export const SequenceType = () => {
  const { sequenceType: inputDataType } = useSelector((state: RootState) => state.parameter);
  const { setParameter } = useParameter();

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
    <tr className="parameter-item">
      <td className='parameter-item-title'>Sequence data type</td>
      <td className="parameter-item-value">
        <select
          key={inputDataType}
          defaultValue={inputDataType}
          onChange={onChange}
          style={{width:'15vw', border:'1px solid #6c6c6c', borderRadius:'5px', background:'white', padding:'3px 10px'}}
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
