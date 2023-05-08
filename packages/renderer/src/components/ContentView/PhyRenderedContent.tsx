import { loadPhylipMatrix } from './heavy-task';
import { MatrixTable } from './Table';

export type PhyRenderedContentProps = {
  content: string;
  className?: string;
};

export const PhyRenderedContent = (props: PhyRenderedContentProps) => {
  const { content } = props;

  const renderedContent = loadPhylipMatrix(content);

  // const getColorForADN = useCallback((char: string) => {
  //   const colors = {
  //     A: 'blue',
  //     T: 'cyan',
  //     G: 'teal',
  //     X: 'purple',
  //     N: 'violet',
  //     C: 'magenta',
  //   };
  //   return (colors as any)[char] || 'black';
  // }, []);

  return (
    <div style={{height: '100%'}}>
      <MatrixTable phylipMatrix={renderedContent} />
    </div>
  );

};

