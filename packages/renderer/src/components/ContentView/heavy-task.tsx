import { PhylipMatrix } from "../../../../common/phylip-matrix"

// export const loadMatrixTable = (content: string) => {
//     const loadPhylipMatrix = (content: string): PhylipMatrix => {
//         const lines = content.split('\n');
//         const dimensionLine = lines[0];
//         const rows = parseInt(dimensionLine.split(' ')[0]);
//         const columns = parseInt(dimensionLine.split(' ')[1]);
//         const dataLines = lines.slice(1, rows + 1);

//         return {
//             dimension: {
//                 rows,
//                 columns,
//             },
//             names: dataLines.map((line) => line.split(' ')[0]),
//             matrix: dataLines.map((line) => line.split(' ').slice(1).join('').slice(0, columns + 1)),
//         }
//     }
//     const matrix = loadPhylipMatrix(content)
//     // const table = (
//     //     <table id='content-table'>
//     //         <tbody>
//     //             {matrix.matrix.map((line, index) => (
//     //                 <tr>
//     //                     {line.split('').map((char, index) => (
//     //                         <td>
//     //                             {char}
//     //                         </td>
//     //                     ))}
//     //                 </tr>
//     //             ))}
//     //         </tbody>
//     //     </table>
//     // )
//     return matrix
// }

export const loadPhylipMatrix = (content: string): PhylipMatrix => {
    const lines = content.split('\n');
    const dimensionLine = lines[0];
    const rows = parseInt(dimensionLine.split(' ')[0]);
    const columns = parseInt(dimensionLine.split(' ')[1]);
    const dataLines = lines.slice(1, rows + 1);
    const matrix = dataLines.map((line) => line.split(' ').slice(1).join('').slice(0, columns + 1))
    const majors = []
    for (let i = 0; i < columns; i++) {
        const counter = {
            A: 0, T: 0, G: 0, C: 0, '-': 0
        } as Record<any, number>
        for (let j = 0; j < rows; j++) {
            const token = matrix[j].charAt(i)
            counter[token] = counter[token] + 1
        }
        majors.push(Object.entries(counter).sort((a, b) => b[1] - a[1])[0][0])
    }
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            const token = matrix[j].charAt(i)
            if (token === majors[i]) {
                matrix[j] = matrix[j].slice(0, i) + '.' + matrix[j].slice(i + 1)
                continue
            }
            if (i > 0 && token === majors[i - 1]) {
                matrix[j] = matrix[j].slice(0, i) + majors[i-1] + matrix[j].slice(i + 1)
                continue
            }
            if (i < columns - 1 && token === majors[i + 1]) {
                matrix[j] = matrix[j].slice(0, i) + majors[i+1] + matrix[j].slice(i + 1)
                continue
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

    }
}