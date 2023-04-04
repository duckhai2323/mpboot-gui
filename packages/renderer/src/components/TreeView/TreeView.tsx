import type { FC } from 'react';
import { useRef } from 'react';
import './phylotree.css';
import { PhylotreeVisualization } from 'phylotree-visualization-demo';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store/root';

export interface TreeViewProps {
  newick?: string;
  width?: number;
  height?: number;
  mode: 'radial' | 'normal';
}

export interface TreeViewWithSizeProps {
  width?: string;
  height?: string;
  mode: 'radial' | 'normal';
}

export const TreeView: FC<TreeViewProps> = props => {
  const { width } = props;
  const { newick } = useSelector((state: RootState) => state.phylogenTree);

  return (
    <PhylotreeVisualization
      input={newick}
      defaultWidth={width}
    />
  );
};

export const TreeViewWithSize: FC<TreeViewWithSizeProps> = ({ mode, height, width }) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{ width: width, height: height }}
    >
      <TreeView
        width={ref.current?.offsetWidth}
        height={ref.current?.offsetHeight}
        mode={mode}
      />
    </div>
  );
};
