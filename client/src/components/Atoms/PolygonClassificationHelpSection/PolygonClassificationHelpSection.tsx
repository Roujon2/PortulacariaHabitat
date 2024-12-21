import React from "react";

import './polygonClassificationHelpSection.css';

import PolygonUpload from "../PolygonUpload/PolygonUpload";
import { FiSave } from "react-icons/fi";
import { TiUpload } from "react-icons/ti";
import { FaMapLocationDot } from "react-icons/fa6";
import HoverText from "../HoverText/HoverText";
import ClassificationConfirmMenu from "../ClassificationConfirmMenu/ClassificationConfirmMenu";


const PolygonClassificationHelpSection = () => (
    <div id="polygon-classification-section" className="help-section">
        <h2 className="help-title">Classifying a Polygon</h2>

        <div className="help-note-container">
            Note: A polygon can only be classified if it is currently placed on the map. Please refer to the "Buttons Guide" for more information.
            <br />
            <div style={{ display: 'block', textAlign: 'center' }}>
                <button className="button-view-on-map">
                    <FaMapLocationDot />
                </button>
                <p style={{ fontSize: '0.8em' }}>Add to map</p>
            </div>
        </div>

        <br />
        
        <p>
            To classify a drawn polygon, click on the following button in the Polygon Details:
        </p>
        <button className={'polygon-details__button-classify'} >
            Spekboom Classification
        </button> 

        <br />

        <p>
            A classification confirmation menu will appear:
        </p>

        <div style={{ display: 'flex', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center' }}>
            <ClassificationConfirmMenu
                onClose={() => { }}
                onConfirm={() => { }}
            />
        </div>
        
        <p className="help-note-container">
                Note: These classification options only impact processing times and do NOT impact the final classification results overlay on the map.
        </p>

        <div
            className="classification-options"
            style={{
                marginTop: '20px',
                marginLeft: '10px',
                marginRight: '20px',
                padding: '15px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
        >
            <div
                className="option-section"
                style={{ marginBottom: '15px' }}
            >
                <h3 style={{ marginBottom: '5px' }}>High Resolution Area Calculation</h3>
                <p style={{ marginBottom: '5px' }}>
                    This option manages the resolution of the hectares displayed on the classification results table, displaying 
                    how many hectares correspond to each Site Suitability Index range.
                </p>
                
                <ul style={{ paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '5px' }}>
                        <strong>Enabled:</strong>
                        <ul style={{ paddingLeft: '15px' }}>
                            <li>• Performs precise area calculations for polygons at a resolution of 100m per pixel, matching the resolution of the classification image.</li>
                            <li>
                            • Significantly slows down processing times for large polygons. This option is recommended only for smaller polygons.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Disabled:</strong>
                        <ul style={{ paddingLeft: '15px' }}>
                            <li>• Utilizes faster, less precise area calculations at over 100m per pixel, resulting in hectare numbers within a range of 90% certainty.</li>
                            <li>• Recommended for large polygons where differences in hectare amount belonging to each index is neglible.</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div
                className="option-section"
                style={{ marginBottom: '15px' }}
            >
                <h3 style={{ marginBottom: '5px' }}>Retrieve Classification Download URL</h3>
                <ul style={{ paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '5px' }}>
                        <strong>Enabled:</strong>
                        <ul style={{ paddingLeft: '15px' }}>
                            <li>• Provides a downloadable URL for the classification results at a resolution of 100m per pixel as a GeoTIFF image.</li>
                            <li>
                            • The downloadable image is unavailable for polygons larger than 19Mha.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Disabled:</strong>
                        <ul style={{ paddingLeft: '15px' }}>
                            <li>• Does not generate a download URL.</li>
                            <li>• No filename input required.</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>




    </div>
);

export default PolygonClassificationHelpSection;