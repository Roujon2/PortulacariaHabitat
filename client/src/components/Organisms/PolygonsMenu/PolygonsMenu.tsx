import React from "react";

import './polygonsMenu.css'
import { Polygon, NewPolygon } from "../../../types/polygon";

import PolygonCard from "../../Atoms/PolygonCard/PolygonCard";
import PolygonDetails from "../../Atoms/PolygonDetails/PolygonDetails";
import PolygonTable from "../../Atoms/PolygonTable/PolygonTable";
import { useEffect } from 'react';

import { usePolygonContext } from "../../../contexts/PolygonContext";

import polygonApi from "../../../api/polygonApi";

import { FaTrashCan } from "react-icons/fa6";
import { FaMapLocationDot } from "react-icons/fa6";

import { PanelGroup, PanelResizeHandle, Panel } from 'react-resizable-panels';
import { MdOutlineExpandMore } from "react-icons/md";


// Polygons menu component
const PolygonsMenu: React.FC = () => {
    const { polygons, loading, loadMorePolygons, deletePolygons, hasMore, updatePolygon } = usePolygonContext();

    const [selectedPolygons, setSelectedPolygons] = React.useState<Polygon[]>([]);

    const [viewPolygonDetails, setViewPolygonDetails] = React.useState<boolean>(false);
    const [editPolygonSelected, setEditPolygonSelected] = React.useState<Polygon>();

    // State var controlling toggle of clearing rows on table (after any kind of polygon modification the rows should be cleared)
    const [toggleClearedRows, setToggleClearedRows] = React.useState<boolean>(false);

    // Function handling toggle cleared rows on table and removing selected polygons
    const handleToggleClearedRows = () => {
        setToggleClearedRows(!toggleClearedRows);
        setSelectedPolygons([]);
    }

    const handleLoadMore = async () => {
        loadMorePolygons();
    }

    // Function to handle when a polygon is selected
    const handleSelectedRows = (selectedRows: Polygon[]) => {
        setSelectedPolygons(selectedRows);
    }

    // Function to handle when a row is clicked to show polygon details
    const handleRowClicked = (polygon: Polygon) => {
        setEditPolygonSelected(polygon);
        setViewPolygonDetails(true);
    }

    // Function to handle deleting selected polygons
    const handleDeleteSelected = () => {
        // Check if the editPolygonSelected is in the selectedPolygons
        if (editPolygonSelected && selectedPolygons.find(p => p.id === editPolygonSelected.id)) {
            setEditPolygonSelected(undefined);
            setViewPolygonDetails(false);
        }

        // Delete selected polygons
        deletePolygons(selectedPolygons);
        
        // Toggle cleared rows
        handleToggleClearedRows();
    }

    // Function to handle deletion from the polygon details
    const handleDelete = (polygon: Polygon) => {
        if (editPolygonSelected && editPolygonSelected.id === polygon.id) {
            setEditPolygonSelected(undefined);
            setViewPolygonDetails(false);
        }

        deletePolygons([polygon]);

        // Toggle cleared rows
        handleToggleClearedRows();
    }

    // Function to handle polygon update
    const handleUpdate = (polygon: Polygon) => {
        updatePolygon(polygon);

        // Toggle cleared rows
        handleToggleClearedRows();
    }


    return (
        <div className='polygons-menu__content'>
            <h1>Polygons Menu</h1>

            <PanelGroup direction='vertical'>
                {/* Polygon Table */}
                <Panel defaultSize={80} minSize={30}>
                    <PolygonTable
                        polygons={polygons}
                        loadMore={loadMorePolygons}
                        onRowSelected={handleSelectedRows}
                        onRowClicked={handleRowClicked}
                        hasMore={hasMore}
                        toggleClearedRows={toggleClearedRows}
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
                            onClick={() => console.log('View on map')} 
                            disabled={selectedPolygons.length < 1} 
                            className={selectedPolygons.length < 1 ? 'button-view-on-map-disabled' : 'button-view-on-map'}
                        >
                            <FaMapLocationDot />
                        </button> 
                      
                    </div>
                </Panel>

                <PanelResizeHandle className='resize-handle__polygons-menu' />

                {/* Polygon Details */}
                <Panel defaultSize={20} minSize={20}>
                    {editPolygonSelected ? (
                        <PolygonDetails
                            polygon={editPolygonSelected}
                            handleEdit={handleUpdate}
                            handleDelete={handleDelete}
                        />
                    ) : (
                        <p className="polygon-details-empty">Select a polygon to view details.</p>
                    )}
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default PolygonsMenu;