import React from "react";
import JSZip from "jszip";

import './polygonUpload.css';
import { IoClose } from "react-icons/io5";
import { TiUpload } from "react-icons/ti";

interface PolygonUploadProps {
    onUpload: (file: File) => void;
    onClose: () => void;
}


const PolygonUpload: React.FC<PolygonUploadProps> = ({ onUpload, onClose }) => {
    const [file, setFile] = React.useState<File>();
    const [zip, setZip] = React.useState<JSZip>();

    // If the file is changed
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Get the files
        const files = e.target.files;

        if(files) {
            // Set the file to the first file
            setFile(files[0]);
            // Load the zip file into a JSZip object
            const zip = new JSZip();
            zip.loadAsync(files[0]).then((zip) => {
                setZip(zip);
            });
        }
    }

    return (
        <div className="polygon-upload">
            <div className="polygon-upload__background"></div>
            <div className="polygon-upload__content">
                <IoClose className="close-button" onClick={onClose}/>
                <h1>Upload KMZ</h1>
                <div className="polygon-upload__buttons">
                    <input type="file" onChange={handleFileChange} />
                    <button className={file ? "upload_button" : "upload_button_disabled"}><TiUpload /></button>
                </div>
            </div>
        </div>
    );
}

export default PolygonUpload;

