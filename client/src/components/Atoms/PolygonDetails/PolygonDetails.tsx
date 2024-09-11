import React from "react";

import { Polygon } from "../../../types/polygon";
import { FiSave } from "react-icons/fi";

import './polygonDetails.css';
import { start } from "repl";

interface PolygonDetailsProps {
    polygon: Polygon;
    handleDelete: (polygonId: number ) => void;
    handleEdit: (polygon: Polygon) => void;
}

const PolygonDetails: React.FC<PolygonDetailsProps> = ({ polygon, handleDelete, handleEdit }) => {
    const [editedPolygon, setEditedPolygon] = React.useState<Polygon>(polygon);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Polygon) => {
        setEditedPolygon({
        ...editedPolygon,
        [field]: e.target.value,
        });
    };

    // Handle coordinates change
    const handleCoordChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, coordType: 'lat' | 'lng') => {
        const updatedCoords = [...editedPolygon.coordinates];
        updatedCoords[index] = {
            ...updatedCoords[index],
            [coordType]: parseFloat(e.target.value),
        };
        setEditedPolygon({
            ...editedPolygon,
            coordinates: updatedCoords,
        });
    };

    return (
        <div className="polygon-details">
            <h2>Polygon Details</h2>

            <div className="polygon-details__field">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" value={editedPolygon.name} onChange={(e) => handleChange(e, 'name')} />
            </div>

            <div className="polygon-details__field">
                <label htmlFor="description">Description</label>
                <textarea id="description" value={editedPolygon.description || ""} onChange={(e) => handleChange(e, 'description')} />
            </div>

            <div className="polygon-details__field polygon-coordinates">
                <label>Coordinates</label>
                <div className="coordinates-container">
                    {editedPolygon.coordinates.map((coord, index) => (
                        <div key={index} className="coordinate-row">
                            <label>Lat</label>
                            <input type="number" value={coord.lat} onChange={(e) => handleCoordChange(e, index, 'lat')} />
                            <label>Lng</label>
                            <input type="number" value={coord.lng} onChange={(e) => handleCoordChange(e, index, 'lng')} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="polygon-details__buttons">
                <button className="polygon-details__button-delete" onClick={() => handleDelete(polygon.id)}>
                    Delete
                </button>

                <button className="polygon-details__button-save" onClick={() => handleEdit(editedPolygon)}>
                    <FiSave />
                    Save
                </button>
            </div>

        </div>
    );
};

export default PolygonDetails;