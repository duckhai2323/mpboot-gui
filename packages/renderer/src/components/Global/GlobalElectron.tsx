import { useEffect } from 'react';
import { useElectron } from '../../hooks/useElectron';
import type { ContextMenuType } from '../../../../common/menu';

const useGlobalElectron = () => {
  const electron = useElectron();

  useEffect(() => {
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
  }, []);
};

export const GlobalElectron = () => {
  useGlobalElectron();

  return <></>;
};
