import { TreeViewWithSize } from '../components/TreeView/TreeView';
import { Layout } from '../components/Layout/Layout';
import { useDispatch } from 'react-redux';
import { Actions } from '../redux/slice/item_menu.slice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './tree-view.module.scss';

const cx = classNames.bind(styles);

export const TreeViewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <>
      <Layout>
        <div
          className={cx('tree-view-container')}
          style={{ width: '95.5vw' }}
        >
          <div className={cx('tree-view-container__header')}>
            <FontAwesomeIcon
              className={cx('arrow-left-icon')}
              icon={faChevronLeft}
              onClick={_e => {
                dispatch(
                  Actions.setItemMenu({
                    itemMenuSideBar: 0,
                    openSideBar: false,
                  }),
                );
                navigate('/main');
              }}
            />
            <span>Back to main</span>
          </div>
          <TreeViewWithSize mode="radial" />
        </div>
      </Layout>
    </>
  );
};
