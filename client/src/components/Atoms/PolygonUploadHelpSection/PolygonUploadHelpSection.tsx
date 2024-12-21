import React from "react";

import './polygonUploadHelpSection.css';

import PolygonUpload from "../PolygonUpload/PolygonUpload";
import { FiSave } from "react-icons/fi";
import { TiUpload } from "react-icons/ti";


const PolygonUploadHelpSection = () => (
    <div id="polygon-upload-section" className="help-section">
        <h2 className="help-title">Uploading a Polygon</h2>

        <p>
            To upload a polygon and add it to the table, click on the following button above the
            Polygon Table on the right side of the screen:
        </p>

        <button className='polygon-upload-help__button' onClick={() => {}}>  
            <TiUpload />
            <span>Upload</span>
        </button>

        <p>Accepted file formats:</p>
        <ul>
            <li>• KML files</li>
            <li>• KMZ files</li>
        </ul>

        <p>
            After selecting a valid file, you would fill in the same form as drawing a polygon.
        </p>
    </div>
);

export default PolygonUploadHelpSection;