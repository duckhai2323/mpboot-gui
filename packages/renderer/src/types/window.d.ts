import type { ExposedElectron } from '../../../common/electron';

declare global {
  interface Window {
    electron: ExposedElectron;
  }
}

window.electron = window.electron || {};
