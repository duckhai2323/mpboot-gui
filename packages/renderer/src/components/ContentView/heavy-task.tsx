import type { PhylipMatrix } from '../../../../common/phylip-matrix';
import type { UIEventHandler } from 'react';


export const createHeavyElement = (content: string) => {
    const _loadPhylipMatrix = (content: string): PhylipMatrix => {
        const lines = content.split('\n');
        const dimensionLine = lines[0];
        const rows = parseInt(dimensionLine.split(' ')[0]);
        const columns = parseInt(dimensionLine.split(' ')[1]);
        const dataLines = lines.slice(1, rows + 1);
        const matrix = dataLines.map((line) => line.split(' ').slice(1).join('').slice(0, columns + 1));
        const majors = [];
        for (let i = 0; i < columns; i++) {
            const counter = {
                A: 0, T: 0, G: 0, C: 0, '-': 0,
            } as Record<any, number>;
            for (let j = 0; j < rows; j++) {
                const token = matrix[j].charAt(i);
                counter[token] = counter[token] + 1;
            }
            majors.push(Object.entries(counter).sort((a, b) => b[1] - a[1])[0][0]);
        }
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                const token = matrix[j].charAt(i);
                if (token === majors[i]) {
                    matrix[j] = matrix[j].slice(0, i) + '.' + matrix[j].slice(i + 1);
                    continue;
                }
                if (i > 0 && token === majors[i - 1]) {
                    matrix[j] = matrix[j].slice(0, i) + majors[i - 1] + matrix[j].slice(i + 1);
                    continue;
                }
                if (i < columns - 1 && token === majors[i + 1]) {
                    matrix[j] = matrix[j].slice(0, i) + majors[i + 1] + matrix[j].slice(i + 1);
                    continue;
                }
            }
        }

        return {
            dimension: {
                rows,
                columns,
            },
            names: dataLines.map((line) => line.split(' ')[0]),
            matrix,
            majors,

        };
    };

    const createElement = (tag: string, inner: string, options?: {
        id?: string,
        classNames?: string[],
    }) => {
        let elem = '';
        if (options?.classNames) {
            elem = `<${tag} ${!!options?.id && `id="${options.id}"`} class="${options.classNames.join(' ')}">${inner}</${tag}>`;
        } else {
            elem = `<${tag} ${!!options?.id && `id="${options.id}"`}>${inner}</${tag}>`;
        }
        return elem;
    };

    const matrix = _loadPhylipMatrix(content);

    const namesTable = createElement('table',
        createElement('tbody', createElement('tr',
            createElement('td', 'Names') +
            matrix.names.map((name) => createElement('tr',
                createElement('td', name))).join(''),
        ))
        , {
            classNames: ['names-table'],
        });

    const matrixTables = createElement('table',
        createElement('tbody', createElement('tr',
            matrix.majors.map((major) => createElement('td', major, {
                classNames: ['cell', 'cell-on-screen', 'major', major],
            })).join('')) +
            matrix.matrix.map((line) => createElement('tr',
                line.split('').map((char, i) => createElement('td', char, {
                    classNames: ['cell', 'cell-on-screen', char === '.' ? `dot ${matrix.majors[i]}` : char],
                })).join(''),
            )).join(''))
        , {
            id: 'content-table',
            classNames: ['content-table'],
        });

    const ret = createElement('div', namesTable + matrixTables, {
        classNames: ['phylip-content-view'],
    });
    return { elementStr: ret, matrix };
};

export const loadPhylipMatrix = (content: string): PhylipMatrix => {
    const lines = content.split('\n');
    const dimensionLine = lines[0];
    const rows = parseInt(dimensionLine.split(' ')[0]);
    const columns = parseInt(dimensionLine.split(' ')[1]);
    const dataLines = lines.slice(1, rows + 1);
    const matrix = dataLines.map((line) => line.split(' ').slice(1).join('').slice(0, columns + 1));
    const majors = [];
    for (let i = 0; i < columns; i++) {
        const counter = {
            A: 0, T: 0, G: 0, C: 0, '-': 0,
        } as Record<any, number>;
        for (let j = 0; j < rows; j++) {
            const token = matrix[j].charAt(i);
            counter[token] = counter[token] + 1;
        }
        majors.push(Object.entries(counter).sort((a, b) => b[1] - a[1])[0][0]);
    }
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            const token = matrix[j].charAt(i);
            if (token === majors[i]) {
                matrix[j] = matrix[j].slice(0, i) + '.' + matrix[j].slice(i + 1);
                continue;
            }
            if (i > 0 && token === majors[i - 1]) {
                matrix[j] = matrix[j].slice(0, i) + majors[i - 1] + matrix[j].slice(i + 1);
                continue;
            }
            if (i < columns - 1 && token === majors[i + 1]) {
                matrix[j] = matrix[j].slice(0, i) + majors[i + 1] + matrix[j].slice(i + 1);
                continue;
            }
        }
    }

    return {
        dimension: {
            rows,
            columns,
        },
        names: dataLines.map((line) => line.split(' ')[0]),
        matrix,
        majors,

    };
};

export const onScroll: UIEventHandler<HTMLDivElement> = (e) => {
    const { scrollLeft, offsetLeft, offsetWidth, scrollWidth } = e.currentTarget;
    console.log({
        scrollLeft, offsetLeft, offsetWidth, scrollWidth,
    });
};

export const createReactElementFromPhylipMatrix = (matrix: PhylipMatrix) => {
    return (
        (
            <div className="phylip-content-view">
                <div className='name-table'>
                    <table >
                        <tr>
                            <td>Names</td>
                        </tr>
                        {matrix.names.map((name, index) => (
                            <tr key={`names-${index}`}>
                                <td className="cell">{name}</td>
                            </tr>),
                        )}
                    </table>
                </div>
                <div className='content-table unselectable' onScroll={onScroll}>
                    <table >
                        <tbody>
                            <tr>
                                {matrix.majors.map((major, index) => (
                                    <td className={`${major} cell cell-on-screen`}>
                                        {major}
                                    </td>
                                ))}
                            </tr>
                            {matrix.matrix.map((line, index) => (
                                <tr>
                                    {line.split('').map((char, index) => (
                                        <td className={char === '.' ? `${matrix.majors[index]} dot cell cell-off-screen` : `${char} cell cell-off-screen`}>
                                            {char}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    );
};