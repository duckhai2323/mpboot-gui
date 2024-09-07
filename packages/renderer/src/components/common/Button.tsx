import type {FC} from 'react';
import classNames from 'classnames/bind';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

type MButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const MButton: FC<MButtonProps> = ({ children, type = 'button', ...rest }) => {
  return (
    <button className={cx('button')} type={type} {...rest}>
      {children}
    </button>
  );
};
