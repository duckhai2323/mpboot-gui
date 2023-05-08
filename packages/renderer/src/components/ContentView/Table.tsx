import Scrollbars from 'react-custom-scrollbars-2';
import type { PhylipMatrix } from '../../../../common/phylip-matrix';
import { useRef, useState } from 'react';

export interface MatrixTableProps {
    phylipMatrix: PhylipMatrix
}

const initialSize = 200;
const cellWidth = 14;

export const MatrixTable = (props: MatrixTableProps) => {
    const { phylipMatrix } = props;
    const maxColumns = phylipMatrix.dimension.columns;
    const [matrixToRender, setMatrixToRender] = useState<PhylipMatrix & { currentRight: number }>({
        ...phylipMatrix,
        matrix: phylipMatrix.matrix.map(e => e.slice(0, initialSize)),
        majors: phylipMatrix.majors.slice(0, initialSize),
        currentRight: initialSize,
    });
    const onScrollHandlerTimeoutRef = useRef<NodeJS.Timeout>();
    const onScroll = (e: any) => {
        if (!matrixToRender) return;
        if (!e.currentTarget) return;
        const { scrollLeft, offsetWidth } = e.currentTarget;
        if (onScrollHandlerTimeoutRef.current) {
            clearTimeout(onScrollHandlerTimeoutRef.current);

        }
        onScrollHandlerTimeoutRef.current = setTimeout(() => {
            onScrollHandler({ scrollLeft, offsetWidth });
        }, 200);
    };
    const onScrollHandler = (currentTarget: any) => {
        if (!matrixToRender) return;
        const { scrollLeft, offsetWidth } = currentTarget;

        const rightIndex = Math.min(Math.floor((scrollLeft + offsetWidth * 4) / cellWidth), maxColumns);
        if (rightIndex < matrixToRender.currentRight) return;

        phylipMatrix.majors.slice(matrixToRender.currentRight, rightIndex);

        const newMajors = matrixToRender.majors.concat(...phylipMatrix.majors.slice(matrixToRender.currentRight, rightIndex));
        const newMatrix = matrixToRender.matrix.map((line, index) => {
            return line.concat(phylipMatrix.matrix[index].slice(matrixToRender!.currentRight, rightIndex));
        });

        setMatrixToRender((e) => ({
            ...e,
            matrix: newMatrix,
            majors: newMajors,
            currentRight: rightIndex,
        }));
    };
    if (!matrixToRender) return <></>;

    return (
        <div className="phylip-content-view">
            <div style={{ height: 'inherit' }}>
                <table className="name-table">
                    <tbody>
                        <tr>
                            <td>Names</td>
                        </tr>
                        {matrixToRender.names.map((name, index) => (
                            <tr key={`names-${index}`}>
                                <td key={`names-${index}`} className="cell cell-on-screen">{name}</td>
                            </tr>),
                        )}
                    </tbody>
                </table>
            </div>
            <Scrollbars onScroll={onScroll} style={{ height: '95%' }} >
                <table className="content-table">
                    <tbody>
                        <tr>
                            {matrixToRender.majors.map((major, index) => (
                                <td key={`major-${index}`} className={`${major} cell cell-on-screen`}>
                                    {major}
                                </td>
                            ))}
                        </tr>
                        {matrixToRender.matrix.map((line, row) => (
                            <tr key={`line-${row}-len-${line.length}`}>
                                {line.split('').map((char, col) => (
                                    <td key={`line-${row}-${col}`} className={char === '.' ? `${matrixToRender!.majors[col]} dot cell cell-on-screen` : `${char} cell cell-on-screen`}>
                                        {char}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Scrollbars>
        </div>
    );
};