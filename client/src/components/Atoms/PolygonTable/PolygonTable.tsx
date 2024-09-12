import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";

import { Polygon } from "../../../types/polygon";

import { MdOutlineExpandMore } from "react-icons/md";


import './polygonTable.css';


interface PolygonTableProps {
    polygons: Polygon[];
    onRowClicked: (polygon: Polygon) => void;
    onRowSelected: (selectedRows: Polygon[]) => void;
    loadMore: () => void;
    hasMore: boolean;
    toggleClearedRows: boolean;
}

const PolygonTable: React.FC<PolygonTableProps> = ({ polygons, onRowClicked, onRowSelected, toggleClearedRows }) => {

    // UseEffect to refresh the table when the polygons change
    React.useEffect(() => {
    }, [polygons]);


    // Define columns for data table
    const columns: TableColumn<Polygon>[] = [
        {
            name: 'Name',
            selector: (row: Polygon) => row.name,
            sortable: true,
        },
        {
            name: 'Locality',
            selector: (row: Polygon) => row.locality,
            sortable: true,
        },
        {
            name: 'Ownership Type',
            selector: (row: Polygon) => row.ownership_type,
            sortable: true,
        },
        {
            name: 'Farm/Series Name',
            selector: (row: Polygon) => row.farm_series_name,
            sortable: true,
        },
        {
            name: 'Date Created',
            selector: (row: Polygon) => row.created_at,
            sortable: true,
        }
        
    ];

    return (
        <div className="polygon-table">
            <DataTable
                title="Polygons"
                columns={columns}
                data={polygons}
                pagination={false}
                fixedHeader
                fixedHeaderScrollHeight="50vh"
                selectableRows
                onSelectedRowsChange={(selected) => onRowSelected(selected.selectedRows)}
                onRowClicked={(row) => onRowClicked(row)}
                clearSelectedRows={toggleClearedRows}
            />
        </div>
    );
};

export default PolygonTable;