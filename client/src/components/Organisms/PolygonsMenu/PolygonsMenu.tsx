import React from "react";

import './polygonsMenu.css'
import { Polygon, NewPolygon } from "../../../types/polygon";

import PolygonCard from "../../Atoms/PolygonCard/PolygonCard";
import PolygonDetails from "../../Atoms/PolygonDetails/PolygonDetails";
import PolygonTable from "../../Atoms/PolygonTable/PolygonTable";
import { useEffect } from 'react';

import { usePolygonContext } from "../../../contexts/PolygonContext";

import polygonApi from "../../../api/polygonApi";

import { RiDeleteBin6Line } from "react-icons/ri";


// Polygons menu component
const PolygonsMenu: React.FC = () => {
    const { polygons, loading, loadMorePolygons, deletePolygons } = usePolygonContext();

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
    }

    // Function to handle deleting selected polygons
    const handleDeleteSelected = () => {
        console.log('Deleting selected polygons');
        deletePolygons(selectedPolygons);
    }



    return (
        <div className='polygons-menu__content'>
            <h1>Polygons Menu</h1>
            {(viewPolygonDetails && editPolygonSelected) ? (
                // Show polygon details when a row is clicked
                <PolygonDetails polygon={editPolygonSelected}  handleEdit={polygonApi.updatePolygon} handleDelete={polygonApi.deletePolygon} />
            ) : (
                <>
                    <PolygonTable
                        polygons={polygons}
                        loadMore={loadMorePolygons}
                        onRowSelected={handleSelectedRows}
                        onRowClicked={handleRowClicked}
                    />
                    {selectedPolygons.length > 0 && (
                        <button onClick={handleDeleteSelected}>Delete Selected</button>
                    )}
                </>
            )}
        </div>
    );
};

export default PolygonsMenu;