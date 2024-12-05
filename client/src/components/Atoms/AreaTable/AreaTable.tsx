import React from "react";

import './areaTable.css'


interface AreaTableProps {
    areas: [string, string, number][];
}


const AreaTable: React.FC<AreaTableProps> = ({ areas }) => {
    

    return (
        <table className="class-areas-table">
            <thead>
                <tr>
                    <th>Spekboom<br/>Growth<br/>Probability</th>
                    <th>Color</th>
                    <th>
                        Hectares
                        <p>
                            <small className="area-table-warning">
                                (Results may not be accurate)
                            </small>
                        </p>
                    </th>
                </tr>
            </thead>
            <tbody>
                {areas.map(([growProb, color, hectares], index) => (
                    <tr key={index}>
                        <td>{growProb}</td>
                        <td className="color" style={{ backgroundColor: color }}></td>
                        <td>{hectares.toLocaleString()} ha</td>
                    </tr>
                ))}
            </tbody>
        </table>

    );
}


export default AreaTable;

