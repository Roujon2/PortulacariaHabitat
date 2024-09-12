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


// Polygons menu component
const PolygonsMenu: React.FC = () => {
    const { polygons, loading, loadMorePolygons, deletePolygons, hasMore } = usePolygonContext();

    const [selectedPolygons, setSelectedPolygons] = React.useState<Polygon[]>([]);

    const [viewPolygonDetails, setViewPolygonDetails] = React.useState<boolean>(false);
    const [editPolygonSelected, setEditPolygonSelected] = React.useState<Polygon>();

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
        console.log('Polygon clicked:', polygon);
    }

    // Function to handle deleting selected polygons
    const handleDeleteSelected = () => {
        console.log('Deleting selected polygons');

        // Check if the editPolygonSelected is in the selectedPolygons
        if (editPolygonSelected && selectedPolygons.find(p => p.id === editPolygonSelected.id)) {
            setEditPolygonSelected(undefined);
            setViewPolygonDetails(false);
        }

        // Delete selected polygons
        deletePolygons(selectedPolygons);
        setSelectedPolygons([]);
    }


    return (
        <div className='polygons-menu__content'>
            <h1>Polygons Menu</h1>

            <PanelGroup direction='vertical'>
                {/* Polygon Table */}
                <Panel defaultSize={60} minSize={30}>
                    <PolygonTable
                        polygons={polygons}
                        loadMore={loadMorePolygons}
                        onRowSelected={handleSelectedRows}
                        onRowClicked={handleRowClicked}
                        hasMore={hasMore}
                    />
                    <div className="buttons-container">
                     
                        <button onClick={handleDeleteSelected} disabled={selectedPolygons.length < 1} className="button-delete">
                            <FaTrashCan />
                        </button>

                        <button onClick={() => console.log('View on map')} disabled={selectedPolygons.length < 1} className="button-map">
                            <FaMapLocationDot />
                        </button> 
                      
                    </div>
                </Panel>

                <PanelResizeHandle className='resize-handle__polygons-menu' />

                {/* Polygon Details */}
                <Panel defaultSize={40} minSize={20}>
                    {editPolygonSelected ? (
                        <PolygonDetails
                            polygon={editPolygonSelected}
                            handleEdit={polygonApi.updatePolygon}
                            handleDelete={polygonApi.deletePolygon}
                        />
                    ) : (
                        <p>Select a polygon to view details.</p>
                    )}
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default PolygonsMenu;