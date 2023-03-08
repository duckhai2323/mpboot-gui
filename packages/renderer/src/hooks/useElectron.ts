import { useDebugValue, useEffect, useMemo, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';
import type { ExposedElectron } from '../../../common/electron';
import { unimplementedExposedElectron } from '../../../common/electron';
import type { ContextMenuType } from '../../../common/menu';

export const useElectronImpl = () => {
  const [electron, setElectron] = useState<ExposedElectron>(unimplementedExposedElectron);

  useDebugValue(electron === unimplementedExposedElectron ? 'not ready' : 'ready')

  useMemo(() => {
    if (window) {
      setElectron(() => window.electron);
    }
  }, [window]);

  useEffect(() => {
    if (!electron || !window) return;
    const listener = (e: MouseEvent) => {
      e.preventDefault();
      if (!e.target) return;
      const target = e.target as HTMLElement;
      if (!target.dataset.contextMenuType || !target.dataset.contextMenuData) return;

      electron.showContentMenu({
        x: e.clientX,
        y: e.clientY,
        type: target.dataset.contextMenuType as ContextMenuType,
        data: target.dataset.contextMenuData,
      });
    };
    window.addEventListener('contextmenu', listener);

    return () => {
      window.removeEventListener('contextmenu', listener);
    };
  }, [electron, window]);
  return electron;
};

export const useElectron = singletonHook(unimplementedExposedElectron, useElectronImpl);
