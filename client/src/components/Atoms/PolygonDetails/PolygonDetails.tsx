import React from "react";

import { Polygon } from "../../../types/polygon";
import { FiSave } from "react-icons/fi";
import { FaTrashCan } from "react-icons/fa6";
import { FaLocationCrosshairs } from "react-icons/fa6";

import './polygonDetails.css';

import { PolygonContextProvider } from "../../../contexts/PolygonContext";

import HoverText from './../HoverText/HoverText';


interface PolygonDetailsProps {
    polygon: Polygon;
    handleEdit: (polygon: Polygon) => void;
    handleCenter: (polygon: Polygon) => void;
    onMap: boolean;
    handleClassify: (polygonId: number) => void;
}

const PolygonDetails: React.FC<PolygonDetailsProps> = ({ polygon, handleEdit, handleCenter, onMap, handleClassify }) => {
    const [editedPolygon, setEditedPolygon] = React.useState<Polygon>(polygon);
    
    // State var to track if there are any differences to save
    const [isEdited, setIsEdited] = React.useState(false);
 
    // Var to track to show save confirmation
    const [showSaveConfirmation, setShowSaveConfirmation] = React.useState(false);
    const [prevPolygon, setPrevPolygon] = React.useState<Polygon>();

    // UseEffect to update edited polygon when polygon changes
    React.useEffect(() => {
        // If the polygon was edited but unsaved
        if(isEdited) {
            setShowSaveConfirmation(true);
        } else{
            setEditedPolygon(polygon);
            setPrevPolygon(polygon);
        }

    }, [polygon]);

    // On save
    const onSave = () => {
        handleEdit(editedPolygon);
        setIsEdited(false);
        setPrevPolygon(editedPolygon);
        setShowSaveConfirmation(false);
    };

    // On save confirmation
    const onSaveConfirmation = () => {
        handleEdit(editedPolygon);
        setIsEdited(false);
        setPrevPolygon(editedPolygon);
        setShowSaveConfirmation(false);

        setEditedPolygon(polygon);
    }

    // Discard changes
    const onDiscard = () => {
        setEditedPolygon(polygon);
        setIsEdited(false);
        setShowSaveConfirmation(false);
    };

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Polygon) => {
        // Update edited polygon
        setEditedPolygon(prev => ({
            ...prev,
            [field]: e.target.value,
        } as Polygon)
        )

        setIsEdited(true);
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

        setIsEdited(true);
    };

    return (
        <div className="polygon-details__container">

            {showSaveConfirmation && (
                <div className="polygon-details__save-confirmation-overlay">
                    <div className="polygon-details__save-confirmation-content">
                        <p>Any unsaved changes will be lost.</p>
                        <div className="polygon-details__save-confirmation-buttons">
                            <button className="polygon-details__button-delete" onClick={onDiscard}>
                                <HoverText title="Discard changes">
                                    <FaTrashCan />
                                </HoverText>
                            </button>
                            <button className="polygon-details__button-save" onClick={onSaveConfirmation}>
                                <HoverText title="Save changes">
                                    <FiSave />
                                </HoverText>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h2>Polygon Details</h2>

            <div className="polygon-details__content">

                <div className="polygon-details__field">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={editedPolygon.name} onChange={(e) => handleChange(e, 'name')} />
                </div>

                <div className="polygon-details__field">
                    <label htmlFor="description">Description</label>
                    <textarea className='textarea' id="description" value={editedPolygon.description || ""} onChange={(e) => handleChange(e, 'description')} />
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

                <div className="polygon-details__field">
                    <label htmlFor="locality">Locality</label>
                    <input type="text" value={editedPolygon.locality} onChange={(e) => handleChange(e, 'locality')} />
                </div>

                <div className="polygon-details__field">
                    <label htmlFor="ownership_type">Ownership Type</label>
                    <input type="text" value={editedPolygon.ownership_type} onChange={(e) => handleChange(e, 'ownership_type')} />
                </div>

                <div className="polygon-details__field">
                    <label htmlFor="farm_series_name">Farm Series Name</label>
                    <input type="text" value={editedPolygon.farm_series_name} onChange={(e) => handleChange(e, 'farm_series_name')} />
                </div>

                <div className="polygon-details__field">
                    <label htmlFor="notes">Notes / Observations</label>
                    <textarea className='textarea' value={editedPolygon.notes || ""} onChange={(e) => handleChange(e, 'notes')} />
                </div>

            </div>

            <div className="polygon-details__buttons">
                <HoverText title={!onMap ? "Polygon not on map" : "Center on map"}>
                    <span>
                        <button className={`${!onMap ? 'polygon-details__button-center-disabled' : 'polygon-details__button-center'}`} onClick={() => handleCenter(polygon)} disabled={!onMap}>
                                <FaLocationCrosshairs />
                        </button>
                    </span>
                </HoverText>
            
                <button className={`${!onMap ? 'polygon-details__button-classify-disabled' : 'polygon-details__button-classify'}`} disabled={!onMap} onClick={() => handleClassify(polygon.id)}>
                    Classify
                </button>

                <button className={`${!isEdited ? 'polygon-details__button-save-disabled' : 'polygon-details__button-save'}`} onClick={onSave} disabled={!isEdited}>
                    <FiSave />
                </button>
            </div>

        </div>
    );
};

export default PolygonDetails;