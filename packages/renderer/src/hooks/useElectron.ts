import { useMemo, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';
import type { ExposedElectron} from '../../../common/electron';
import { unimplementedExposedElectron } from '../../../common/electron';

export const useElectronImpl = () => {
  const [electron, setElectron] = useState<ExposedElectron>(unimplementedExposedElectron);
  useMemo(() => {
    if (window) {
      setElectron(() => window.electron);
    }
  }, [window]);

  return electron;
};

export const useElectron = singletonHook(unimplementedExposedElectron, useElectronImpl)