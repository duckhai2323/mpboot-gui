import Scrollbars from 'react-custom-scrollbars-2';
import type { PhylipMatrix } from '../../../../common/phylip-matrix';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
    if (!matrixToRender) return;
    if (rightIndex < matrixToRender.currentRight) return;

    phylipMatrix.majors.slice(matrixToRender.currentRight, rightIndex);

    const newMajors = matrixToRender.majors.concat(
      ...phylipMatrix.majors.slice(matrixToRender.currentRight, rightIndex),
    );
    const newMatrix = matrixToRender.matrix.map((line, index) => {
      return line.concat(
        phylipMatrix.matrix[index].slice(matrixToRender!.currentRight, rightIndex),
      );
    });

    setMatrixToRender(e => ({
      ...e,
      matrix: newMatrix,
      majors: newMajors,
      currentRight: rightIndex,
    }));
  };
  const onScrollHandler = (currentTarget: any) => {
    if (!matrixToRender) return;
    const { scrollLeft, offsetWidth } = currentTarget;

    const rightIndex = Math.min(Math.floor((scrollLeft + offsetWidth * 4) / cellWidth), maxColumns);
    loadToRightIndex(rightIndex);
  };

  useEffect(() => {
    if (!highlightCell) return;
    if (!matrixToRender) return;
    const { col, row } = highlightCell;
    if (col >= matrixToRender.currentRight) {
      loadToRightIndex(col + 1);
    }
    setTimeout(() => {
      const cell = document.querySelector(`[data-col="${col}"][data-row="${row}"]`);
      if (cell) {
        cell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 0);
  }, [highlightCell]);

  if (!matrixToRender) return <></>;

  return (
    <>
      <div className="phylip-content-view unselectable">
        <div style={{ height: 'inherit' }}>
          <table className="name-table">
            <tbody>
              <tr>
                <td>Names</td>
              </tr>
              {matrixToRender.names.map((name, index) => (
                <tr key={`names-${index}`}>
                  <td
                    key={`names-${index}`}
                    className="cell cell-on-screen"
                  >
                    {name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Scrollbars
          onScroll={onScroll}
          className="scrollbars"
        >
          <table
            className="content-table"
            onClick={onCellClick}
          >
            <tbody>
              <tr>
                {matrixToRender.majors.map((major, index) => (
                  <td
                    key={`major-${index}`}
                    className={`${major} cell cell-on-screen`}
                  >
                    {major}
                  </td>
                ))}
              </tr>
              {matrixToRender.matrix.map((line, row) => (
                <tr key={`line-${row}-len-${line.length}`}>
                  {line.split('').map((char, col) => {
                    const isHightlighted =
                      highlightCell && highlightCell.col === col && highlightCell.row === row;
                    let className = isHightlighted
                      ? 'cell cell-on-screen highlighted'
                      : 'cell cell-on-screen';
                    className += char === '.' ? ` ${matrixToRender!.majors[col]} dot` : ` ${char}`;
                    const key = `line-${row}-${col}${isHightlighted ? '-highlighted' : ''}`;
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
            </tbody>
          </table>
        </Scrollbars>
      </div>
    </>
  );
});

export const CellPosition = (props: any) => {
  const { currentCell, maxRows, maxColumns, onCellSubmit } = props;
  const { row, col } = currentCell;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      (formRef.current!.elements[0] as any).value = row;
      (formRef.current!.elements[1] as any).value = col;
    }
  }, [row, col]);

  const onKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const row = parseInt((formRef.current!.elements[0] as any).value);
      const col = parseInt((formRef.current!.elements[1] as any).value);
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
