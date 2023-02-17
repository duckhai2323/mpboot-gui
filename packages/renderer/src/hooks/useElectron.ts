import { useMemo, useState } from 'react';
import type { ExposedElectron} from '../../../common/electron';
import { unimplementedExposedElectron } from '../../../common/electron';

export const useElectron = () => {
  const [electron, setElectron] = useState<ExposedElectron>(unimplementedExposedElectron);
  useMemo(() => {
    if (window) {
      setElectron(() => window.electron);
    }
  }, [window]);
  return electron;
};
