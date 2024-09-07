import type { ReactNode,FC } from 'react';
import classNames from 'classnames/bind';
import style from './Layout.module.scss';
import { Sidebar } from '../Sidebar/Sidebar';

const cx = classNames.bind(style);

interface LayoutProps {
  children?: ReactNode,
}

export const Layout: FC<LayoutProps> = ({children}) => {
  return (
    <div className={cx('container')}>
      <Sidebar/>
      <div className={cx('content')}>
        {children}
      </div>
    </div>
  );
};
