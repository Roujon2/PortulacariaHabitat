import React from "react";

import './areaTable.css'


interface AreaTableProps {
    classAreasObj: { areas: [string, string, number][], exact: boolean };
}


const AreaTable: React.FC<AreaTableProps> = ({ classAreasObj }) => {

    // Function to reformat hectares
    const formatHectares = (hectares: number) => {
        if (typeof hectares !== 'number') {
            return 'Invalid data';
        }
        if (hectares > 1e6){
            return `${(hectares / 1e6).toFixed(2)} Mha`;
        }  
        else if (hectares > 1e3){
            return `${(hectares / 1e3).toFixed(2)} Kha`;
        }
        else{
            return hectares.toFixed(0) + ' ha';
        }
    };

    // Safety check
    if(!classAreasObj || !classAreasObj.areas || !classAreasObj.areas.length){
        classAreasObj = {areas: [['Error retrieving Spekboom class areas', '#0000ff', 0]], exact: false}
    }
    

    return (
        <table className="class-areas-table">
            <thead>
                <tr>
                    <th>Site<br/>Suitability<br/>Index</th>
                    <th>Color</th>
                    <th>
                        Hectares
                        {!classAreasObj.exact && (
                            <p>
                                <small className="area-table-warning">
                                    (90% certainty)
                                </small>
                            </p>
                        )}
                    </th>
                </tr>
            </thead>
            <tbody>
                {classAreasObj.areas.map(([growProb, color, hectares], index) => (
                    <tr key={index}>
                        <td className="suitabilityIndex">{growProb}</td>
                        <td className="color" style={{ backgroundColor: color }}></td>
                        <td>{formatHectares(hectares)}</td>
                    </tr>
                ))}
            </tbody>
        </table>

    );
}


export default AreaTable;

