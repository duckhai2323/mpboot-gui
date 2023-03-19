import React from 'react';
import { Link } from 'react-router-dom';
import { TreeViewWithSize } from '../components/TreeView/TreeView';

export const TreeViewPage = () => {
  return (
    <>
      <Link to={'/main'}>Back to Main</Link>
      <TreeViewWithSize
        width="100%"
        height="90%"
        mode="radial"
      />
    </>
  );
};
