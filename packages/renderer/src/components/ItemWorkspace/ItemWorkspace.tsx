import classNames from 'classnames/bind';
import styles from './ItemWorkspace.module.scss';
import type { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { IWorkspace } from '../../../../common/workspace';
import { useElectron } from '../../hooks/useElectron';

const cx = classNames.bind(styles);

interface ItemWorkspaceProps {
  workspace: IWorkspace
  onClick: (event: React.MouseEvent<HTMLButtonElement>, workspace: IWorkspace) => void;
  onListenRemoveWorkspace: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void;
}
const formatDateToString = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return `${day}/${month}/${year}`;
};

export const ItemWorkspace: FC<ItemWorkspaceProps>  = ({workspace, onClick,onListenRemoveWorkspace}) => {

  const electron = useElectron();

  const handleRemoveWorkspace = async (event: React.MouseEvent<HTMLButtonElement>,id: number) => {
    onListenRemoveWorkspace(event,id);
    await electron.removeWorkspace(id);
};

  return (
    <div className={cx('item-workspace')}>
      <div className={cx('item-workspace__content')}>
      <span>{workspace.id}</span>
      <span>{workspace.name}</span>
      <span>{formatDateToString(workspace.createdAt)}</span>
      </div>

      <div className={cx('item-workspace__button')}>
        <button onClick={_e => {
          onClick(_e,workspace);
        }}>
          <FontAwesomeIcon icon={faFolderOpen}/>
        </button>
        <button onClick={(e)=>handleRemoveWorkspace(e,workspace.id)}>
          <FontAwesomeIcon icon={faTrash}/>
        </button>
      </div>
    </div>
  );
};
