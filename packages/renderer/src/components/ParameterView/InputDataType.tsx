import React from 'react';

export const InputDataType = () => {
    return (
        <tr>
            <td>Input data type</td>
            <td>
                <select defaultValue={""}>
                    <option value="" >Auto detect</option>
                    <option value="BIN">BIN</option>
                    <option value="DNA">DNA</option>
                    <option value="AA">AA</option>
                    <option value="CODON">CODON</option>
                    <option value="MORPH">MORPH</option>
                </select>
            </td>
        </tr>
    )
}