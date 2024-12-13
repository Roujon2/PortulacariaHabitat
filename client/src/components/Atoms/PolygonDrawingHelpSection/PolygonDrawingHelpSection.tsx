import React from "react";

import './polygonDrawingHelpSection.css';


const PolygonDrawingHelpSection = () => (
    <div id="polygon-drawing-section" className="help-section">
        <h2 className="help-title">Drawing a Polygon</h2>

        <p>To begin drawing a polygon on the Google Map, select the polygon icon in the top-left corner
            of the map to draw a shape. The polygon will be drawn on the map as you click on the map to
            add points. Click on the first point to close the polygon.
        </p>

        <div className="button-info">
            <h3>Draw Polygon</h3>
            <div className="button-details">
                <span className="buttons-span">
                    <button className="polygon-drawing__button-draw">
                        Draw
                    </button>
                </span>

                <p>Click on the map to draw a polygon. Click on the first point to close the polygon.</p>
            </div>
        </div>

        <div className="button-info">
            <h3>Undo</h3>
            <div className="button-details">
                <span className="buttons-span">
                    <button className="polygon-drawing__button-undo">
                        Undo
                    </button>
                </span>

                <p>Removes the last point added to the polygon.</p>
            </div>
        </div>

        <div className="button-info">
            <h3>Clear</h3>
            <div className="button-details">
                <span className="buttons-span">
                    <button className="polygon-drawing__button-clear">
                        Clear
                    </button>
                </span>

                <p>Clears the polygon from the map.</p>
            </div>
        </div>
    </div>
);

export default PolygonDrawingHelpSection;