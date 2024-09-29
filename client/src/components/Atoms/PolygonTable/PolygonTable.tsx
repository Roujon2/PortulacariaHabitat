import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";

import { Polygon } from "../../../types/polygon";

import { MdOutlineExpandMore } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaLocationCrosshairs } from "react-icons/fa6";


import HoverText from "../HoverText/HoverText";

import { usePolygonContext } from "../../../contexts/PolygonContext";


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
    handleCenterOnMap: () => void;
}

const PolygonTable: React.FC<PolygonTableProps> = ({ polygons, selectedPolygons, onRowClicked, onRowSelected, toggleClearedRows, handleDeleteSelected, hasMore, handleLoadMore, handlePutOnMap, handleCenterOnMap }) => {
    // PolygonContext
    const { polygonsOnMap } = usePolygonContext();

    // UseEffect to refresh the table when the polygons change
    React.useEffect(() => {
    }, [polygons]);

    // Function to check if any selected are currently on the map
    const isSelectedOnMap = () => {
        return selectedPolygons.some(p => polygonsOnMap.some(pMap => pMap.id === p.id));
    }

    // Conditional row styles to highlight rows on map
    const conditionalRowStyles = [
        {
            when: (row: Polygon) => polygonsOnMap.some(p => p.id === row.id),
            style: {
                // Light green highlight
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
            },
        },
    ];



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
                columns={columns}
                data={polygons}
                pagination={false}
                fixedHeader
                selectableRows
                onSelectedRowsChange={(selected) => onRowSelected(selected.selectedRows)}
                onRowClicked={(row) => onRowClicked(row)}
                clearSelectedRows={toggleClearedRows}
                className="polygon-table__table"
                conditionalRowStyles={conditionalRowStyles}
            />
            <div className="buttons-container"> 
                <div className="buttons-map-container">
                    <HoverText title={selectedPolygons.length < 1 ? "No polygons selected" : "Map selected"}>
                        <span>
                            <button 
                                onClick={handlePutOnMap} 
                                disabled={selectedPolygons.length < 1} 
                                className={selectedPolygons.length < 1 ? 'button-view-on-map-disabled' : 'button-view-on-map'}
                            >
                                <FaMapLocationDot />
                            </button> 
                        </span>
                    </HoverText>

                    <HoverText title={selectedPolygons.length < 1 ? "No polygons selected" : "Center on map"}>
                        <span>
                            <button 
                                onClick={handleCenterOnMap} 
                                disabled={!isSelectedOnMap()}
                                className={!isSelectedOnMap() ? 'button-center-on-map-disabled' : 'button-center-on-map'}
                            >
                                <FaLocationCrosshairs />
                            </button> 
                        </span>
                    </HoverText>
                </div>

                <HoverText title={hasMore ? "Load more" : "No more polygons to load"}>
                    <span>
                        <button 
                            className={hasMore ? 'button-load-more' : 'button-load-more-disabled'} 
                            onClick={handleLoadMore} 
                            disabled={!hasMore}
                        >
                            <MdOutlineExpandMore className="load-more" />
                        </button>
                    </span>
                </HoverText>

                <HoverText title={selectedPolygons.length < 1 ? "No polygons selected" : "Delete selected"}>
                    <span>
                        <button 
                            onClick={handleDeleteSelected} 
                            disabled={selectedPolygons.length < 1} 
                            className={selectedPolygons.length < 1 ? 'button-delete-disabled' : 'button-delete'}
                        >
                            <FaTrashCan />
                        </button>
                    </span>
                </HoverText>
            </div>


        </div>
    );
};

export default PolygonTable;