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
}

const PolygonTable: React.FC<PolygonTableProps> = ({ polygons, onRowClicked, loadMore, onRowSelected }) => {
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
            selector: (row: Polygon) => row.ownershipType,
            sortable: true,
        },
        {
            name: 'Farm/Series Name',
            selector: (row: Polygon) => row.seriesName,
            sortable: true,
        },
        {
            name: 'Date Created',
            selector: (row: Polygon) => row.created,
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
            />
            <MdOutlineExpandMore className="load-more" onClick={loadMore} />
        </div>
    );
};

export default PolygonTable;