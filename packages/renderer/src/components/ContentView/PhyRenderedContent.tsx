import { useCallback, useState } from 'react';
import { useWorker } from "@koale/useworker";
import { loadPhylipMatrix } from './heavy-task';

export type PhyRenderedContentProps = {
  content: string;
  className?: string;
};

export const PhyRenderedContent = (props: PhyRenderedContentProps) => {
  const { content, className } = props;

  const [renderedContent, setRenderedContent] = useState<string | JSX.Element[] | JSX.Element>(content);

  const [
    loadPhylipMatrixWorker,
  ] = useWorker(loadPhylipMatrix);

  const onFormatingClick = () => {
    if (!content) return;
    loadPhylipMatrixWorker(content).then((matrix) => {
      return (
        (
          <table id='content-table' className='unselectable'>
            <tr>
              {matrix.majors.map((name, index) => (
                <td key={`majors-${index}`} className={`${name} cell`}>{name}</td>
              ))}
            </tr>
            <tbody>
              {matrix.matrix.map((line, index) => (
                <tr key={`row-${index}`}>
                  {line.split('').map((char, index) => (
                    <td key={`data-${index}`} className={char === '.' ? `${matrix.majors[index]} dot cell` : `${char} cell`}>
                      {char}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )
      )
    }).then(setRenderedContent)
  }
  const getColorForADN = useCallback((char: string) => {
    const colors = {
      A: 'blue',
      T: 'cyan',
      G: 'teal',
      X: 'purple',
      N: 'violet',
      C: 'magenta',
    };
    return (colors as any)[char] || 'black';
  }, []);

  // const getRenderedContent = useCallback((content: string): JSX.Element[] => {
  //   const components = [];
  //   let lastCharacters = content[0];
  //   let shouldFormat = false;
  //   for (let i = 1; i < content.length; i++) {
  //     if (lastCharacters[0] !== content[i]) {
  //       if (shouldFormat) {
  //         components.push(
  //           <span style={{ color: getColorForADN(lastCharacters[0]) }}>{lastCharacters}</span>,
  //         );
  //       } else {
  //         components.push(<span>{lastCharacters}</span>);
  //       }
  //       lastCharacters = content[i];
  //     } else {
  //       lastCharacters += content[i];
  //     }
  //     if (content[i] === '\n') shouldFormat = false;
  //     if (content[i] === ' ') shouldFormat = true;
  //   }
  //   if (shouldFormat) {
  //     components.push(
  //       <span style={{ color: getColorForADN(lastCharacters[0]) }}>{lastCharacters}</span>,
  //     );
  //   } else {
  //     components.push(<span>{lastCharacters}</span>);
  //   }
  //   return components;
  // }, []);

  return (
    <div>
      <button onClick={onFormatingClick}>Formating</button>
      <pre className={className}>{renderedContent}</pre>;
    </div>
  )

};

