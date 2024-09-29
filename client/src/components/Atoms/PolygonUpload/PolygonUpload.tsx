import React from "react";
import JSZip from "jszip";

import { NewPolygon } from "../../../types/polygon";


import './polygonUpload.css';
import { IoClose } from "react-icons/io5";
import { TiUpload } from "react-icons/ti";
import { FiSave } from "react-icons/fi";

import polygonApi from "../../../api/polygonApi";

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
    const [coordinates, setCoordinates] = React.useState<google.maps.LatLngLiteral[]>();


    // Function to process kml content and extract coordinates
    const processKML = (kml: string) => {
        try{
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(kml, "text/xml");

            const coordinates = xmlDoc.getElementsByTagName("coordinates")[0].textContent;

            // If there are no coordinates, return
            if(!coordinates) {
                throw new Error("No coordinates found in KML file");
            }

            // Split the coordinates and parse them
            const coords = coordinates.split(" ");
            const parsedCoords = coords.map((coord) => {
                const [lng, lat] = coord.split(",");
                const parsedLng = parseFloat(lng);
                const parsedLat = parseFloat(lat);

                // Check if the coordinates are valid
                if(isNaN(parsedLat) || isNaN(parsedLng)) {
                    return null;
                }

                return { lat: parsedLat, lng: parsedLng };
            }).filter((coord) => coord !== null) as google.maps.LatLngLiteral[];

            setCoordinates(parsedCoords);
        }catch(err){
            console.error(err);
        }
    };

    // If the file is changed
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        // Get the files
        const files = e.target.files;

        if(files) {
            // Set the file to the first file\
            const file = files[0];
            setFile(file);

            // Check if file is kmz or kml
            if(file.name.endsWith(".kmz")) {
                // Unzip and extract kml
                const zip = new JSZip();
                const unzipped = await zip.loadAsync(file);
                const kml = Object.keys(unzipped.files).find((key) => key.endsWith(".kml"));

                if(kml) {
                    const kmlContent = await unzipped.files[kml].async("text");
                    // Process kml and save coordinates
                    processKML(kmlContent);
                }
            }else if(file.name.endsWith(".kml")) {
                // Handle kml file
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    processKML(content);
                };
                reader.readAsText(file);
            }

            setLoading(false);
            setShowFileDetails(true);
        }
    }

    // Function to handle save
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        // If there are no coordinates, return
        if(!coordinates) {
            alert ("No coordinates found in KML file");
            return;
        }

        // Create polygon object
        const NewPolygon: NewPolygon = {
            name: polygonName,
            description: polygonDescription,
            locality: locality,
            ownership_type: ownership_type,
            notes: notes,
            farm_series_name: farm_series_name,
            coordinates: coordinates,
            classified: false,
        };

        console.log(NewPolygon);

        // Save new polygon to backend
        polygonApi.savePolygon(NewPolygon);
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
                    <input type="file" onChange={handleFileChange} accept=".kml, .kmz"/>
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

