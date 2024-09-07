import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useElectron } from '../../hooks/useElectron';
import { useWorkspace } from '../../hooks/useWorkspace';
import { MButton } from '../common/Button';
import { WorkspaceDirectoryInput } from './WorkspaceDirectoryInput';
import { WorkspaceInputDataInput } from './WorkspaceInputDataInput';
import { WorkspaceNameInput } from './WorkspaceNameInput';
import classNames from 'classnames/bind';
import styles from './NewWorkspace.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'src/redux/store/root';
import { Actions } from '../../redux/slice/item_menu.slice';

const cx = classNames.bind(styles);

export type NewWorkspaceData = {
  workspaceDirPath: string;
  workspaceName: string;
  inputData?: NewWorkspaceInputData[];
};
export type NewWorkspaceInputData = {
  refName: string;
  inputPath: string;
  type: 'file' | 'directory';
};

export const NewWorkspace = () => {
  const { setWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stateSideBar = useSelector((state: RootState) => state.sidebarState);
  const electron = useElectron();
  const onFormSubmit = useCallback(
    (e: any) => {
      e.preventDefault();
      (async () => {
        try {
          const elements = e.target.elements;
          const workspace: NewWorkspaceData = {} as NewWorkspaceData;
          workspace.workspaceDirPath = elements.workspaceDir.value;
          workspace.workspaceName = elements.workspaceName.value;
          workspace.inputData = [];
          if (!elements.inputData?.length) {
            if (elements.inputData.value) {
              const inputData = JSON.parse(elements.inputData.value);
              workspace.inputData?.push(inputData);
            }
          } else {
            for (let i = 0; i < elements.inputData?.length || 0; i++) {
              const inputData = JSON.parse(elements.inputData[i].value);
              workspace.inputData?.push(inputData);
            }
          }
          console.log(workspace);
          const ws = await electron.createWorkspace({
            inputData: workspace.inputData,
            path: workspace.workspaceDirPath,
            name: workspace.workspaceName,
          });
          setWorkspace(ws);
          dispatch(
            Actions.setItemMenu({
              itemMenuSideBar: 0,
              openSideBar: false,
            }),
          );
          navigate('/main');
        } catch (err: any) {
          toast.error(err.message);
        }
      })();
    },
    [navigate],
  );

  return (
    <div
      className={cx('new-workspace-container')}
      style={{ width: stateSideBar.openSideBar ? '83vw' : '95.5vw' }}
    >
      <div className={cx('new-workspace-container__header')}>
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
      <div className={cx('new-workspace-container__content')}>
        <form onSubmit={onFormSubmit}>
          <WorkspaceDirectoryInput />
          <WorkspaceNameInput />
          <WorkspaceInputDataInput />
          <div className={cx('submit-btn')}>
            <MButton type="submit">Create</MButton>
          </div>
        </form>
      </div>
    </div>
  );
};
