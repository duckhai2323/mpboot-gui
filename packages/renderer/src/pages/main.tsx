import { Allotment } from 'allotment';
import { useWindowSize } from 'usehooks-ts';
import { ContentView } from '../components/ContentView/ContentView';
import { FileTree } from '../components/FileTree/FileTree';
import { LogView } from '../components/LogView/LogView';
import { ParameterView } from '../components/ParameterView/ParameterView';

import { TreePreviewWithSize } from '../components/TreePreview/TreePreview';
import { Layout } from '../components/Layout/Layout';
import { useDispatch } from 'react-redux';
import { Actions } from '../redux/slice/item_menu.slice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export const MainPage = () => {
  const size = useWindowSize();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTreeViewPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch(
      Actions.setItemMenu({
        itemMenuSideBar: 0,
        openSideBar: false,
      }),
    );
    navigate('/tree-view');
  };

  return (
    <Layout>
      <Allotment>
        <Allotment.Pane
          minSize={size.width * 0.2}
          className="allotment__pane--scroll-on-overflow-y"
        >
          <FileTree />
        </Allotment.Pane>

        <Allotment.Pane
          minSize={size.width * 0.45}
          preferredSize={size.width * 0.5}
        >
          <Allotment vertical>
            <Allotment.Pane className="allotment__pane--scroll-on-overflow-x allotment__pane--scroll-on-overflow-y">
              <ContentView />
            </Allotment.Pane>
            <Allotment.Pane>
              <LogView />
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>

        <Allotment.Pane
          minSize={size.width * 0.3}
          preferredSize={size.width * 0.3}
        >
          <Allotment vertical>
            <Allotment.Pane>
              <ParameterView />
            </Allotment.Pane>
            <Allotment.Pane>
              <div style={{ cursor: 'pointer', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center', padding:'10px 20px', borderBottom:'1px solid #E7E7E7' }}>
                <div></div>
                <span
                onClick={handleTreeViewPage}
              >
                Tree View
              </span>
              <FontAwesomeIcon icon={faChevronRight}/>
              </div>
              <TreePreviewWithSize
                width="100%"
                height="90%"
                mode="normal"
              />
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
      </Allotment>
    </Layout>
  );
};
