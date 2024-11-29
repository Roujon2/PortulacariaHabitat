import React from "react";

import './areaTable.css'


interface AreaTableProps {
    areas: [string, number][];
}


const AreaTable: React.FC<AreaTableProps> = ({ areas }) => {
    

    return (
        <table className="class-areas-table">
            <thead>
                <tr>
                    <th>Color</th>
                    <th>Hectares</th>
                </tr>
            </thead>
            <tbody>
                {areas.map(([color, hectares], index) => (
                    <tr key={index}>
                        <td className="color" style={{ backgroundColor: color }}></td>
                        <td>{hectares.toLocaleString()} ha</td>
                    </tr>
                ))}
            </tbody>
        </table>

    );
}


export default AreaTable;

