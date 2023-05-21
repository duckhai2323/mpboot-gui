import { useEffect, useRef, useState } from 'react';
import { useElectron } from '../hooks/useElectron';
import type { InstallationGetMetadataResponse } from '../../../common/installation';
import type { MPBootInstallation } from '../../../main/src/configuration';

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
  const { metadata, installVersion, progress, errorMsg, newBinaryPath, applyVersion } =
    useInstallation();
  const versionIdRef = useRef<HTMLInputElement>(null);
  if (!metadata) {
    return <div>Loading...</div>;
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
    <>
      <h1>Metadata</h1>
      <table>
        <tbody>
          {Object.entries(metadata).map(([key, value]) => {
            if (key === 'versions') return;
            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h1>More installation</h1>
      <form>
        <input
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
          type="button"
          onClick={onInstallClick}
        >
          Install
        </button>
        <button
          type="submit"
          onClick={onApplyClick}
        >
          Apply
        </button>
      </form>
      <div>Progress: {progress.percentage}</div>
      {errorMsg && <div>Error: {errorMsg}</div>}
      {newBinaryPath && <div>Download completed, binary path: {newBinaryPath}</div>}
    </>
  );
};
