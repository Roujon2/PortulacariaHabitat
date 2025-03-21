import React from "react";

import { Polygon } from "../../../types/polygon";
import { FiSave } from "react-icons/fi";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { IoMdDownload } from "react-icons/io";

import ClassificationConfirmMenu from "../ClassificationConfirmMenu/ClassificationConfirmMenu";

import { reuleaux } from 'ldrs';

import './polygonDetails.css';

import HoverText from './../HoverText/HoverText';
import { usePolygonContext } from "../../../contexts/PolygonContext";

interface PolygonDetailsProps {
    polygon: Polygon;
    handleEdit: (polygon: Polygon) => void;
    handleCenter: (polygons: Polygon[]) => void;
    onMap: boolean;

    handleSpekboomClassification: (polygonId: number, classificationOptions: { exactArea: boolean; downloadUrl: boolean; filename?: string }) => void;

    resultOnMap: boolean;

    loading: boolean;

    handleOverlayDownload: (polygonId: number) => void;
}

const PolygonDetails: React.FC<PolygonDetailsProps> = ({ polygon, handleEdit, handleCenter, onMap, handleSpekboomClassification, loading, resultOnMap, handleOverlayDownload }) => {
    const [editedPolygon, setEditedPolygon] = React.useState<Polygon>(polygon);

    const { overlays } = usePolygonContext();
    
    // State var to track if there are any differences to save
    const [isEdited, setIsEdited] = React.useState(false);
 
    // Var to track to show save confirmation
    const [showSaveConfirmation, setShowSaveConfirmation] = React.useState(false);
    const [prevPolygon, setPrevPolygon] = React.useState<Polygon>();

    const [showClassificationConfirmation, setShowClassificationConfirmation] = React.useState(false);


    // Register reuleaux
    reuleaux.register('loading-reuleaux');

    // UseEffect to update edited polygon when polygon changes
    React.useEffect(() => {
        // If the polygon was edited but unsaved
        if(isEdited) {
            setShowSaveConfirmation(true);
        } else{
            setEditedPolygon(polygon);
            setPrevPolygon(polygon);
        }

    }, [polygon, polygon.classification_status]);

    // On save
    const onSave = (e: React.FormEvent) => {
        e.preventDefault();
        handleEdit(editedPolygon);
        setIsEdited(false);
        setPrevPolygon(editedPolygon);
        setShowSaveConfirmation(false);
    };


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

            {showClassificationConfirmation && (
                <div className="classification-confirm-overlay">
                    <ClassificationConfirmMenu 
                        onClose={() => setShowClassificationConfirmation(false)}
                        onConfirm={(options) => {
                            setShowClassificationConfirmation(false);
                            handleSpekboomClassification(polygon.id, options);
                        }
                        }
                    />
                </div>
            )}

            {showSaveConfirmation && (
                <div className="polygon-details__save-confirmation-overlay">
                    <div className="polygon-details__save-confirmation-content">
                        <p>Any unsaved changes will be lost.</p>
                        <div className="polygon-details__save-confirmation-buttons">
                            <button className="polygon-details__button-delete" onClick={onDiscard}>
                                <HoverText title="Discard changes">
                                    <h4>Discard</h4>
                                </HoverText>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h2>Polygon Details</h2>

            <form className="polygon-details__form" onSubmit={onSave}>
                <div className="polygon-details__content">

                    <div className="polygon-details__field">
                        <label htmlFor="name">Name <span className="required">*</span></label>
                        <input type="text" id="name" value={editedPolygon.name} onChange={(e) => handleChange(e, 'name')} required />
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
                                    <input type="number" value={coord.lat} onChange={(e) => handleCoordChange(e, index, 'lat')} required/>
                                    <label>Lng</label>
                                    <input type="number" value={coord.lng} onChange={(e) => handleCoordChange(e, index, 'lng')} required/>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="polygon-details__field">
                        <label htmlFor="locality">Locality <span className="required">*</span></label>
                        <input type="text" value={editedPolygon.locality} onChange={(e) => handleChange(e, 'locality')} required />
                    </div>

                    <div className="polygon-details__field">
                        <label htmlFor="ownership_type">Ownership Type <span className="required">*</span></label>
                        <input type="text" value={editedPolygon.ownership_type} onChange={(e) => handleChange(e, 'ownership_type')} required/>
                    </div>

                    <div className="polygon-details__field">
                        <label htmlFor="farm_series_name">Farm Series Name <span className="required">*</span></label>
                        <input type="text" value={editedPolygon.farm_series_name} onChange={(e) => handleChange(e, 'farm_series_name')} required/>
                    </div>

                    <div className="polygon-details__field">
                        <label htmlFor="notes">Notes / Observations</label>
                        <textarea className='textarea' value={editedPolygon.notes || ""} onChange={(e) => handleChange(e, 'notes')} />
                    </div>

                

                    <div className="polygon-details__buttons">
                        <HoverText title={!onMap ? "Polygon not on map" : "Center on map"}>
                            <span>
                                <button className={`${!onMap ? 'polygon-details__button-center-disabled' : 'polygon-details__button-center'}`} onClick={() => handleCenter([polygon])} disabled={!onMap} type='button'>
                                        <FaLocationCrosshairs />
                                </button>
                            </span>
                        </HoverText>
                    
                        {/* renderClassificationButton() */}

                        {!loading ? 
                            (resultOnMap ? 
                                <HoverText title={`${!overlays[polygon.id].downloadUrl ? "Classification result download unavailable" : "Download classification result"}`}>
                                    <span>
                                        <button className={`${!overlays[polygon.id].downloadUrl ? 'polygon-details__button-download-disabled' : 'polygon-details__button-download'}`} onClick={() => handleOverlayDownload(polygon.id)} type='button' disabled={overlays[polygon.id].downloadUrl ? false : true}>
                                            {overlays[polygon.id].downloadUrl ? 
                                                <IoMdDownload /> 
                                                : 
                                                (
                                                    polygon.area_hectares > 19e6 ?
                                                        <span className="download-unavailable">Download Unavailable: Polygon too large</span>
                                                    :
                                                        <span className="download-unavailable">Download Disabled</span>
                                                )
                                            }
                                        </button>
                                    </span>
                                </HoverText>

                                :

                                <button className={`${!onMap ? 'polygon-details__button-classify-disabled' : 'polygon-details__button-classify'}`} disabled={!onMap} onClick={() => setShowClassificationConfirmation(true)} type='button'>
                                    Spekboom Classification
                                </button> 
                            )
                        :
                            <div className='spinner-container'>
                                {React.createElement('loading-reuleaux', {
                                    size: "25",
                                    stroke: "3",
                                    'stroke-length': "0.15",
                                    'bg-opacity': "0.1",
                                    speed: "1", 
                                    color: '#208350'
                                })}
                            </div>
                        }

                        <button className={`${!isEdited ? 'polygon-details__button-save-disabled' : 'polygon-details__button-save'}`} disabled={!isEdited} type="submit">
                            <FiSave />
                        </button>
                    </div>

                </div>

            </form>

        </div>
    );
};

export default PolygonDetails;
