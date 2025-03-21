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

import { TiUpload } from "react-icons/ti";
import PolygonUpload from "../../Atoms/PolygonUpload/PolygonUpload";

import { useAlert } from "../../../contexts/AlertContext";


// Polygons menu component
const PolygonsMenu: React.FC = () => {
    const { polygons, loading, loadMorePolygons, getSpekboomClassification, deletePolygons, hasMore, updatePolygon, putOnMap, selectedPolygonDetailsId, 
        setSelectedPolygonDetailsId, setCenterOnPolygons, polygonsOnMap, polygonResultsOnMap,
        overlays } = usePolygonContext();

    const { showAlert } = useAlert();

    const [selectedPolygons, setSelectedPolygons] = React.useState<Polygon[]>([]);

    const [editPolygonSelected, setEditPolygonSelected] = React.useState<Polygon>();

    // State var controlling toggle of clearing rows on table (after any kind of polygon modification the rows should be cleared)
    const [toggleClearedRows, setToggleClearedRows] = React.useState<boolean>(false);

    const [viewPolygonUpload, setViewPolygonUpload] = React.useState<boolean>(false);

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
        setSelectedPolygonDetailsId(polygon.id);
    }

    // Function to handle deleting selected polygons
    const handleDeleteSelected = () => {
        // Check if the editPolygonSelected is in the selectedPolygons
        if (editPolygonSelected && selectedPolygons.find(p => p.id === editPolygonSelected.id)) {
            setEditPolygonSelected(undefined);
        }

        // Delete selected polygons
        deletePolygons(selectedPolygons);
        
        // Toggle cleared rows
        handleToggleClearedRows();
    }

    // Function to handle polygon update
    const handleUpdate = (polygon: Polygon) => {
        updatePolygon(polygon);

        // Set center on polygon
        setCenterOnPolygons([polygon]);

        // Toggle cleared rows
        handleToggleClearedRows();
    }

    // Function to handle putting selected on map
    const handlePutOnMap = () => {
        // Put selected polygons on map
        putOnMap(selectedPolygons);

        // Toggle cleared rows
        handleToggleClearedRows();
    }

    // Function to handle centering selected on map
    const handleCenterOnMap = () => {
        // Center all selected on map
        if (selectedPolygons.length > 0) {
            setCenterOnPolygons(selectedPolygons);
        }
    }

    // Function to handle the classification overlay download button click
    const handleClassificationOverlayDownload = async (polygonId: number) => {
        // Get overlay object
        const overlay = overlays[polygonId];

        if (!overlay) {
            showAlert("Corresponding polygon not found. Please retry the classification.", "error");
            return;
        }

        // Get the classification overlay download url
        const downloadUrl = overlay.downloadUrl;

        if (!downloadUrl) {
            showAlert("Download url not found. Please retry the classification. If the issue persists, contact an administrator.", "error");
            return;
        }

        // Create a download link and click it
        const downloadLink = document.createElement("a");
        downloadLink.href = downloadUrl;
        downloadLink.target = "_blank";
        downloadLink.download = '';
        downloadLink.click();
    };

    useEffect(() => {
        if (selectedPolygonDetailsId) {
            // Find the polygon with the selected id
            const selectedPolygonDetails = polygons.find(p => p.id === selectedPolygonDetailsId);

            // If the polygon is found, set it as the editPolygonSelected
            if (selectedPolygonDetails){
                setEditPolygonSelected(selectedPolygonDetails);
            }else{
                setSelectedPolygonDetailsId(null);
            }
        }else if (selectedPolygonDetailsId === null) {
            setEditPolygonSelected(undefined);
        }
    }
    , [selectedPolygonDetailsId, polygons]);


    return (
        <div className='polygons-menu__content'>
            <h1>Polygons</h1>

            <button className='polygon-upload__button' onClick={() => setViewPolygonUpload(true)}>
                <TiUpload />
                <span>Upload</span>
            </button>

            {viewPolygonUpload && (<PolygonUpload onClose={() => setViewPolygonUpload(false)} />)}

            <PanelGroup direction='vertical'>
                {/* Polygon Table */}
                <Panel defaultSize={50} minSize={30} className="polygon-table_container">
                    <PolygonTable
                        polygons={polygons}
                        handleLoadMore={handleLoadMore}
                        onRowSelected={handleSelectedRows}
                        onRowClicked={handleRowClicked}
                        hasMore={hasMore}
                        toggleClearedRows={toggleClearedRows}
                        handleDeleteSelected={handleDeleteSelected}
                        selectedPolygons={selectedPolygons}
                        handlePutOnMap={handlePutOnMap}
                        handleCenterOnMap={handleCenterOnMap}
                    />
                </Panel>

                <PanelResizeHandle className='resize-handle__polygons-menu' />

                {/* Polygon Details */}
                <Panel defaultSize={50} minSize={20}>
                    {editPolygonSelected ? (
                        <PolygonDetails
                            polygon={editPolygonSelected}
                            handleEdit={handleUpdate}
                            handleCenter={setCenterOnPolygons}
                            onMap={polygonsOnMap.find(p => p.id === editPolygonSelected.id) ? true : false}
                            handleSpekboomClassification={getSpekboomClassification}
                            loading={loading}
                            resultOnMap={polygonResultsOnMap.find(p => p.id === editPolygonSelected.id) ? true : false}
                            handleOverlayDownload={handleClassificationOverlayDownload}
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