import { useCallback, useMemo } from 'react';

export type PhyRenderedContentProps = {
  content: string;
  className?: string;
};

export const PhyRenderedContent = (props: PhyRenderedContentProps) => {
  const { content, className } = props;
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

  const getRenderedContent = useCallback((content: string): JSX.Element[] => {
    const components = [];
    let lastCharacters = content[0];
    let shouldFormat = false;
    for (let i = 1; i < content.length; i++) {
      if (lastCharacters[0] !== content[i]) {
        if (shouldFormat) {
          components.push(
            <span style={{ color: getColorForADN(lastCharacters[0]) }}>{lastCharacters}</span>,
          );
        } else {
          components.push(<span>{lastCharacters}</span>);
        }
        lastCharacters = content[i];
      } else {
        lastCharacters += content[i];
      }
      if (content[i] === '\n') shouldFormat = false;
      if (content[i] === ' ') shouldFormat = true;
    }
    if (shouldFormat) {
      components.push(
        <span style={{ color: getColorForADN(lastCharacters[0]) }}>{lastCharacters}</span>,
      );
    } else {
      components.push(<span>{lastCharacters}</span>);
    }
    return components;
  }, []);

  const renderedContent = useMemo(() => {
    return getRenderedContent(content);
  }, [content]);

  return <pre className={className}>{renderedContent}</pre>;
};
