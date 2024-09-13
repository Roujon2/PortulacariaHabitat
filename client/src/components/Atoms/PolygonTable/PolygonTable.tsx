import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";

import { Polygon } from "../../../types/polygon";

import { MdOutlineExpandMore } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import { FaMapLocationDot } from "react-icons/fa6";


import './polygonTable.css';


interface PolygonTableProps {
    polygons: Polygon[];
    selectedPolygons: Polygon[];
    onRowClicked: (polygon: Polygon) => void;
    onRowSelected: (selectedRows: Polygon[]) => void;
    handleLoadMore: () => void;
    hasMore: boolean;
    handleDeleteSelected: () => void;
    toggleClearedRows: boolean;
    handlePutOnMap: () => void;
}

const PolygonTable: React.FC<PolygonTableProps> = ({ polygons, selectedPolygons, onRowClicked, onRowSelected, toggleClearedRows, handleDeleteSelected, hasMore, handleLoadMore, handlePutOnMap }) => {

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
                selectableRows
                onSelectedRowsChange={(selected) => onRowSelected(selected.selectedRows)}
                onRowClicked={(row) => onRowClicked(row)}
                clearSelectedRows={toggleClearedRows}
                className="polygon-table__table"
            />
            <div className="buttons-container"> 
                <button 
                    onClick={handleDeleteSelected} 
                    disabled={selectedPolygons.length < 1} 
                    className={selectedPolygons.length < 1 ? 'button-delete-disabled' : 'button-delete'}
                >
                    <FaTrashCan />
                </button>

                <button 
                    className={hasMore ? 'button-load-more' : 'button-load-more-disabled'} 
                    onClick={handleLoadMore} 
                    disabled={!hasMore}
                >
                    <MdOutlineExpandMore className="load-more" />
                </button>

                <button 
                    onClick={handlePutOnMap} 
                    disabled={selectedPolygons.length < 1} 
                    className={selectedPolygons.length < 1 ? 'button-view-on-map-disabled' : 'button-view-on-map'}
                >
                    <FaMapLocationDot />
                </button> 
            </div>


        </div>
    );
};

export default PolygonTable;