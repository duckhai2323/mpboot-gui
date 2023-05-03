import { useRef } from 'react';
import type { ExposedElectron } from '../../../common/electron';

export const useElectron = () => {
  const electron = useRef(window.electron);

  if (!electron.current) {
    console.error('electron is not ready');
  }
  return electron.current || ({} as ExposedElectron);
};
