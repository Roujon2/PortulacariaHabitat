import React from "react";

import './polygonDrawingHelpSection.css';

import SavePolygonMenu from "../SavePolygonMenu/SavePolygonMenu";
import { FiSave } from "react-icons/fi";


const PolygonDrawingHelpSection = () => (
    <div id="polygon-drawing-section" className="help-section">
        <h2 className="help-title">Drawing a Polygon</h2>

        <p>To begin drawing a polygon on the Google Map, select the polygon icon in the top-left corner
            of the map to draw a shape. The polygon will be drawn on the map as you click on the map to
            add points. Click on the first point to close the polygon.
        </p>

        <p>Once the polygon is drawn, the following Save Menu will appear:</p>

        <div className="polygon-drawing__save-menu">
            <SavePolygonMenu 
                onCancel={() => {}}
                onSave={() => {}}
            />
            <p className="help-note-container">Note: The fields marked with a red asterisk are required.</p>
        </div>

        <p>Fill in the required fields and click the <FiSave/> icon to save the polygon.</p>

    </div>
);

export default PolygonDrawingHelpSection;