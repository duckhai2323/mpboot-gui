import { useEffect } from 'react';
import { useElectron } from '../../hooks/useElectron';
import { useNavigate } from 'react-router-dom';

export const GlobalEvent = () => {
  const electron = useElectron();
  const navigate = useNavigate();
  useEffect(() => {
    if (!electron || typeof electron.testAvailable !== 'function') return;

    const unsubscribeFunc = electron.subscribeOnInstallationWillOpen(() => {
      navigate('/installation');
    });

    return unsubscribeFunc;
  }, [electron]);
  return <></>;
};
