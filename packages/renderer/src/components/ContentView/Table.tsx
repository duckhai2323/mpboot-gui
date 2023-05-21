import Scrollbars from 'react-custom-scrollbars-2';
import type { PhylipMatrix } from '../../../../common/phylip-matrix';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

export interface MatrixTableProps {
  phylipMatrix: PhylipMatrix;
  onCellClick: (e: any) => void;
  highlightCell?: { col: number; row: number };
}

const initialSize = 200;
const cellWidth = 14;

export const MatrixTable = memo((props: MatrixTableProps) => {
  const { phylipMatrix, onCellClick, highlightCell } = props;
  const maxColumns = phylipMatrix.dimension.columns;
  const [matrixToRender, setMatrixToRender] = useState<PhylipMatrix & { currentRight: number }>({
    ...phylipMatrix,
    matrix: phylipMatrix.matrix.map(e => e.slice(0, initialSize)),
    majors: phylipMatrix.majors.slice(0, initialSize),
    currentRight: initialSize,
  });
  const onScrollHandlerTimeoutRef = useRef<NodeJS.Timeout>();
  const lastHighlightCellRef = useRef<Element>();
  // const currentRightRef = useRef<number>(initialSize);

  const onScroll = useCallback((e: any) => {
    if (!e.currentTarget) return;
    const { scrollLeft, offsetWidth } = e.currentTarget;
    if (onScrollHandlerTimeoutRef.current) {
      clearTimeout(onScrollHandlerTimeoutRef.current);
    }
    onScrollHandlerTimeoutRef.current = setTimeout(() => {
      onScrollHandler({ scrollLeft, offsetWidth });
    }, 200);
  }, []);

  const loadToRightIndex = (rightIndex: number) => {
    if (rightIndex <= matrixToRender.currentRight) return;

    const newMajors = matrixToRender.majors.concat(
      ...phylipMatrix.majors.slice(matrixToRender.currentRight, rightIndex),
    );
    const newMatrix = matrixToRender.matrix.map((line, index) => {
      return line.concat(phylipMatrix.matrix[index].slice(matrixToRender.currentRight, rightIndex));
    });

    setMatrixToRender(e => {
      if (e.currentRight >= rightIndex) return e;
      return {
        ...e,
        matrix: newMatrix,
        majors: newMajors,
        currentRight: rightIndex,
      };
    });
  };
  const onScrollHandler = (currentTarget: any) => {
    const { scrollLeft, offsetWidth } = currentTarget;

    const rightIndex = Math.min(Math.floor((scrollLeft + offsetWidth * 4) / cellWidth), maxColumns);
    loadToRightIndex(rightIndex);
  };

  useEffect(() => {
    if (!highlightCell) return;
    const { col, row } = highlightCell;
    if (col >= matrixToRender.currentRight) {
      loadToRightIndex(col + 2);
    }
    setTimeout(() => {
      const cell = document.querySelector(`[data-col="${col}"][data-row="${row}"]`);
      if (!cell) return;
      if (lastHighlightCellRef.current)
        lastHighlightCellRef.current.classList.remove('highlighted');
      cell.classList.add('highlighted');
      lastHighlightCellRef.current = cell;
      cell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 0);
  }, [highlightCell]);

  if (!matrixToRender) return <></>;

  return (
    <>
      <div className="phylip-content-view unselectable">
        <NameTables names={matrixToRender.names} />
        <Scrollbars
          onScroll={onScroll}
          className="scrollbars"
        >
          <table
            className="content-table"
            onClick={onCellClick}
          >
            <tbody>
              <MajorRows
                majors={matrixToRender.majors}
                currentRight={matrixToRender.currentRight}
              />
              <MatrixRows
                matrix={matrixToRender.matrix}
                majors={matrixToRender.majors}
                currentRight={matrixToRender.currentRight}
              />
            </tbody>
          </table>
        </Scrollbars>
      </div>
    </>
  );
});

type NameTablesProps = {
  names: string[];
};

const MajorRows = memo(
  ({ majors }: { majors: PhylipMatrix['majors']; currentRight: number }) => {
    return (
      <tr>
        {majors.map((major, index) => (
          <td
            key={`major-${index}`}
            className={`${major} cell cell-on-screen`}
          >
            {major}
          </td>
        ))}
      </tr>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.currentRight === nextProps.currentRight;
  },
);

const MatrixRows = memo(
  ({
    matrix,
    majors,
    currentRight: _currentRight,
  }: {
    matrix: PhylipMatrix['matrix'];
    majors: PhylipMatrix['majors'];
    currentRight: number;
  }) => {
    return (
      <>
        {matrix.map((line, row) => (
          <tr key={`line-${row}-len-${line.length}`}>
            {line.split('').map((char, col) => {
              let className = 'cell cell-on-screen';
              className += char === '.' ? ` ${majors[col]} dot` : ` ${char}`;
              const key = `line-${row}-${col}`;
              return (
                <td
                  key={key}
                  data-row={row}
                  data-col={col}
                  className={className}
                >
                  {char}
                </td>
              );
            })}
          </tr>
        ))}
      </>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.currentRight === nextProps.currentRight;
  },
);

export const NameTables = memo(
  (props: NameTablesProps) => {
    const { names } = props;
    return (
      <div>
        <table className="name-table">
          <tbody>
            <tr>
              <td>Names</td>
            </tr>
            {names.map((name, index) => (
              <tr key={`names-${index}`}>
                <td className="cell cell-on-screen">{name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  },
);

export const CellPosition = (props: any) => {
  const { currentCell, maxRows, maxColumns, onCellSubmit } = props;
  const { row, col } = currentCell;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      (formRef.current!.elements[0] as any).value = row + 1;
      (formRef.current!.elements[1] as any).value = col + 1;
    }
  }, [row, col]);

  const onKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const row = parseInt((formRef.current!.elements[0] as any).value) - 1;
      const col = parseInt((formRef.current!.elements[1] as any).value) - 1;
      if (row >= 0 && row < maxRows && col >= 0 && col < maxColumns) {
        onCellSubmit({ row, col });
      }
    }
  };

  return (
    <>
      <form
        ref={formRef}
        onKeyDown={onKeyDown}
      >
        <span>Row </span>
        <input style={{ width: 50 }} />
        <span>/ {maxRows}</span>
        <span> Col </span>
        <input style={{ width: 50 }} />
        <span>/ {maxColumns}</span>
      </form>
    </>
  );
};
