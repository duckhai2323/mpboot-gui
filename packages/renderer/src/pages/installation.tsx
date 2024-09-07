import { useEffect, useRef, useState } from 'react';
import { useElectron } from '../hooks/useElectron';
import type { InstallationGetMetadataResponse } from '../../../common/installation';
import type { MPBootInstallation } from '../../../main/src/configuration';
import { Layout } from '../components/Layout/Layout';
import classNames from 'classnames/bind';
import styles from './installation.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'src/redux/store/root';
import { Actions } from '../redux/slice/item_menu.slice';
import { useNavigate } from 'react-router-dom';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const useInstallation = (): {
  metadata: InstallationGetMetadataResponse | undefined;
  installVersion: (versionId: string, versionName: string) => void;
  applyVersion: (
    versionName: string,
    binaryPath: string,
    installationType: MPBootInstallation,
  ) => void;
  progress: { percentage: number };
  errorMsg: string;
  newBinaryPath: string;
} => {
  const electron = useElectron();
  const [metadata, setMetadata] = useState<InstallationGetMetadataResponse>();
  const [progress, setProgress] = useState<{
    percentage: number;
  }>({
    percentage: 0,
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [newBinaryPath, setNewBinaryPath] = useState<string>('');
  const bouncingTimerRef = useRef<NodeJS.Timeout>();
  const [counter, setCounter] = useState<number>(0);
  useEffect(() => {
    (async () => {
      const metadata = await electron.getInstallationMetadata();
      setMetadata(metadata);
    })();
  }, [counter]);

  const installVersion = (versionId: string, versionName: string) => {
    electron.installVersion(
      {
        versionId,
        versionName,
      },
      progress => {
        if (bouncingTimerRef.current) {
          clearTimeout(bouncingTimerRef.current);
        }
        bouncingTimerRef.current = setTimeout(() => {
          setProgress({
            percentage: progress.progress * 100,
          });
        }, 10);
      },
      binaryPath => {
        setMetadata(metadata => {
          if (!metadata) return metadata;
          return {
            ...metadata,
            versions: metadata?.versions.map(version => {
              if (version.versionId === versionId) {
                return {
                  ...version,
                  binaryPath,
                };
              }
              return version;
            }),
          };
        });
        setNewBinaryPath(binaryPath);
      },
      errorMsg => {
        setErrorMsg(errorMsg);
      },
    );
  };

  const applyVersion = (
    versionName: string,
    binaryPath: string,
    installationType: MPBootInstallation,
  ) => {
    electron.useVersion(versionName, binaryPath, installationType);
    setCounter(counter => counter + 1);
  };
  return { metadata, installVersion, progress, errorMsg, newBinaryPath, applyVersion };
};

export const InstallationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stateSideBar = useSelector((state: RootState) => state.sidebarState);
  const { metadata, installVersion, progress, errorMsg, newBinaryPath, applyVersion } =
    useInstallation();
  const versionIdRef = useRef<HTMLInputElement>(null);
  if (!metadata) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  const onInstallClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!versionIdRef.current) return;
    if (versionIdRef.current.value.includes('(Installed)')) return;
    if (versionIdRef.current.value.includes('Pre-installed')) return;
    const version = metadata.versions.find(
      version => version.versionName === versionIdRef.current?.value,
    );
    if (!version) return;
    installVersion(version.versionId, version.versionName);
  };

  const onApplyClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!versionIdRef.current) return;
    if (versionIdRef.current.value.includes('Pre-installed')) {
      applyVersion('', '', 'pre-installed');
      return;
    }
    const version = metadata.versions.find(version =>
      versionIdRef.current?.value.includes(version.versionName),
    );
    if (!version) return;
    if (!version.binaryPath) return;
    applyVersion(version.versionName, version.binaryPath, 'in-app');
  };
  return (
    <Layout>
      <div
        className={cx('installation-container')}
        style={{ width: stateSideBar.openSideBar ? '83vw' : '95.5vw' }}
      >
        <div className={cx('installation-container__header')}>
          <FontAwesomeIcon
            className={cx('arrow-left-icon')}
             icon={faChevronLeft}
            onClick={_e => {
              dispatch(
                Actions.setItemMenu({
                  itemMenuSideBar: 1,
                  openSideBar: stateSideBar.openSideBar,
                }),
              );
              navigate('/dashboard');
            }}
          />
          <span>Dashboard</span>
        </div>

        <div className={cx('installation-container__version')}>
          {Object.entries(metadata).map(([key, value]) => {
            if (key === 'versions') return;
            return (
              <div className={cx('current-infor-version')}>
                <span className={cx('current-infor-version__key')}>{key}</span>
                <span className={cx('current-infor-version__value')}>{value}</span>
              </div>
            );
          })}
        </div>
        <div className={cx('installation-container__install')}>
          <span>More installation</span>
          <form>
            <input
              className={cx('input-version')}
              ref={versionIdRef}
              type="text"
              list="mpboot-version"
              name="versionId"
              id="mpboot-version-input"
            />
            <datalist id="mpboot-version">
              {metadata.versions.map(version => {
                if (version.binaryPath) {
                  return (
                    <option
                      key={version.versionId}
                      value={`${version.versionName} (Installed)`}
                    />
                  );
                }
                return (
                  <option
                    key={version.versionId}
                    value={version.versionName}
                    selected={metadata.installationType === 'pre-installed'}
                  />
                );
              })}
              <option
                key="pre-installed"
                value="Pre-installed"
              />
            </datalist>
            <button
              className={cx('btn')}
              type="button"
              onClick={onInstallClick}
            >
              Install
            </button>
            <button
              className={cx('btn')}
              type="submit"
              onClick={onApplyClick}
            >
              Apply
            </button>
          </form>
          <div className={cx('progress-install')}>Progress: {progress.percentage}</div>
          {errorMsg && <div>Error: {errorMsg}</div>}
          {newBinaryPath && <div>Download completed, binary path: {newBinaryPath}</div>}
        </div>
      </div>
    </Layout>
  );
};
