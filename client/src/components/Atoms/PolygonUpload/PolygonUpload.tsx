import React from "react";
import JSZip from "jszip";

import { NewPolygon } from "../../../types/polygon";

import './polygonUpload.css';
import { IoClose } from "react-icons/io5";
import { TiUpload } from "react-icons/ti";
import { FiSave } from "react-icons/fi";

interface PolygonUploadProps {
    onUpload: (file: File) => void;
    onClose: () => void;
}


const PolygonUpload: React.FC<PolygonUploadProps> = ({ onUpload, onClose }) => {
    const [file, setFile] = React.useState<File>();
    const [zip, setZip] = React.useState<JSZip>();

    const [showSavePolygon, setShowSavePolygon] = React.useState<boolean>(false);
    const [showFileDetails, setShowFileDetails] = React.useState<boolean>(false);

    const [loading, setLoading] = React.useState<boolean>(false);

    // Form state vars
    const [polygonName, setPolygonName] = React.useState<string>("");
    const [polygonDescription, setPolygonDescription] = React.useState<string>("");
    const [locality, setLocality] = React.useState<string>("");
    const [ownership_type, setOwnershipType] = React.useState<string>("");
    const [notes, setNotes] = React.useState<string>("");
    const [farm_series_name, setSeriesName] = React.useState<string>("");

    // If the file is changed
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        // Get the files
        const files = e.target.files;

        if(files) {
            // Set the file to the first file
            setFile(files[0]);
            // Load the zip file into a JSZip object
            const zip = new JSZip();
            zip.loadAsync(files[0]).then((zip) => {
                setZip(zip);
                setLoading(false);
                setShowFileDetails(true);
            });
        }
    }

    // Function to handle save
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        // Create polygon object
        const NewPolygon: NewPolygon = {
            name: polygonName,
            description: polygonDescription,
            locality: locality,
            ownership_type: ownership_type,
            notes: notes,
            farm_series_name: farm_series_name,
            coordinates: [],
            classified: false,
        };

    }

    // Function to handle upload
    const handleUpload = () => {
        if (file) {
            setShowFileDetails(false);
            setShowSavePolygon(true);
            setFile(undefined);
        }
    };
            

    return (
        <div className="polygon-upload">
            <div className="polygon-upload__background"></div>
            <div className="polygon-upload__content">
                <IoClose className="close-button" onClick={onClose}/>
                <h1>Upload KMZ</h1>
                <div className="polygon-upload__buttons">
                    <input type="file" onChange={handleFileChange} />
                    <button className={file ? "upload_button" : "upload_button_disabled"} onClick={handleUpload}><TiUpload /></button>
                </div>

                {showFileDetails && file && zip && (
                    <div className="polygon-upload__file-info">
                        <h2>File Info</h2>
                        <p>File Name: {file.name}</p>
                        <p>File Size: {file.size} bytes</p>
                        <p>Number of Files: {Object.keys(zip.files).length}</p>
                    </div>
                )}

                {showSavePolygon && (
                    <div className="polygon-upload__save-polygon">
                        <form className="menu-fields" onSubmit={handleSave}>
                            <label className="menu-label">
                                <div className="menu-type">
                                    Name: <span className="required">*</span>
                                </div>
                                <input
                                    type="text"
                                    value={polygonName}
                                    onChange={(e) => setPolygonName(e.target.value)}
                                    required
                                />
                            </label>

                            <label className="menu-label">
                                <div className="menu-type">
                                    Locality: <span className="required">*</span>
                                </div>
                                <input
                                    type="text"
                                    value={locality}
                                    onChange={(e) => setLocality(e.target.value)}
                                    required
                                />
                            </label>

                            <label className="menu-label">
                                <div className="menu-type">
                                    Description:
                                </div>
                                <textarea
                                    value={polygonDescription}
                                    onChange={(e) => setPolygonDescription(e.target.value)}
                                    className="textarea"
                                />
                            </label>

                            <label className="menu-label">
                                <div className="menu-type">
                                    Ownership Type: <span className="required">*</span>
                                </div>
                                <input
                                    type="text"
                                    value={ownership_type}
                                    onChange={(e) => setOwnershipType(e.target.value)}
                                    required
                                />
                            </label>

                            <label className="menu-label">
                                <div className="menu-type">
                                    Farm/Series Name: <span className="required">*</span>
                                </div>
                                <input
                                    type="text"
                                    value={farm_series_name}
                                    onChange={(e) => setSeriesName(e.target.value)}
                                    required
                                />
                            </label>

                            <label className="menu-label">
                                <div className="menu-type">
                                Notes/Observations:
                                </div>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="textarea"
                                />
                            </label>

                            <div className="menu-buttons">
                                <button type="submit"><FiSave /></button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PolygonUpload;

