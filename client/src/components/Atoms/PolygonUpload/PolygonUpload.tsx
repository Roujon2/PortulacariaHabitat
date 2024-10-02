import React, { useEffect } from "react";
import JSZip from "jszip";

import { NewPolygon } from "../../../types/polygon";


import './polygonUpload.css';
import { IoClose } from "react-icons/io5";
import { TiUpload } from "react-icons/ti";
import { FiSave } from "react-icons/fi";

import polygonApi from "../../../api/polygonApi";

interface PolygonUploadProps {
    onClose: () => void;
}


const PolygonUpload: React.FC<PolygonUploadProps> = ({ onClose }) => {
    const [file, setFile] = React.useState<File>();
    const [error, setError] = React.useState<string | null>(null);

    const [showSavePolygon, setShowSavePolygon] = React.useState<boolean>(false);

    const [loading, setLoading] = React.useState<boolean>(false);

    // Form state vars
    const [polygonName, setPolygonName] = React.useState<string>("");
    const [polygonDescription, setPolygonDescription] = React.useState<string>("");
    const [locality, setLocality] = React.useState<string>("");
    const [ownership_type, setOwnershipType] = React.useState<string>("");
    const [notes, setNotes] = React.useState<string>("");
    const [farm_series_name, setSeriesName] = React.useState<string>("");
    const [coordinates, setCoordinates] = React.useState<google.maps.LatLngLiteral[]>();


    // UseEffect tracking coordinates change
    useEffect(() => {
        if(coordinates && coordinates.length > 0) {
            // Coordinates are found and valid
            setError(null);
            setLoading(false);
        }
    }, [coordinates]);


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
        // Get the files
        const files = e.target.files;

        if(!files || !files[0]){
            setFile(undefined);
            setCoordinates(undefined);
            return;
        }

        const selectedFile = files[0];
        setFile(selectedFile); 

        // Reset values
        setShowSavePolygon(false);
        setError(null);
        setCoordinates(undefined);
        setLoading(true);

        // Process file
        try{
            // Check if file is kmz or kml
            if(selectedFile.name.endsWith(".kmz")) {
                // Unzip and extract kml
                const zip = new JSZip();
                const unzipped = await zip.loadAsync(selectedFile);
                const kml = Object.keys(unzipped.files).find((key) => key.endsWith(".kml"));

                if(kml) {
                    const kmlContent = await unzipped.files[kml].async("text");
                    // Process kml and save coordinates
                    processKML(kmlContent);
                }
            }else if(selectedFile.name.endsWith(".kml")) {
                // Handle kml file
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    processKML(content);
                };
                reader.readAsText(selectedFile);
            }else{
                // Set error if file is not kml or kmz
                setError("Unsupported file type. Please upload a KML or KMZ file");
            }
        }catch(err){
            setError("An error occurred while processing the file. Please try again.");
        }
    };

    // Function to handle save
    const handleSave = (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();

        // If there are no coordinates, return
        if(!coordinates) {
            setError("No coordinates found in KML file. Ensure the file is valid and try again.");
            setLoading(false);
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
        };

        // Save new polygon to backend
        polygonApi.savePolygon(NewPolygon).then((res) => {
            setShowSavePolygon(false);
            setPolygonName("");
            setPolygonDescription("");
            setLocality("");
            setOwnershipType("");
            setNotes("");
            setSeriesName("");
            setCoordinates(undefined);
            setLoading(false);

            onClose();
        }).catch((err) => {
            console.error(err);
            setError("An error occurred while saving the polygon. Please try again.");
            setLoading(false);
        });
    }

    // Function to handle upload
    const handleUpload = async () => {
        if (!file){
            setError("No file selected. Please select a file to upload.");
            return;
        }

        if(!coordinates || coordinates.length === 0) {
            setError("No coordinates found in KML file. Ensure the file is valid and try again.");
            return;
        }
    
        // Pre set name to file name
        setPolygonName(file.name.split(".")[0]);
        setShowSavePolygon(true);
    };
            

    return (
        <div className="polygon-upload">
            <div className="polygon-upload__background"></div>
            <div className="polygon-upload__content">
                <IoClose className="close-button" onClick={onClose}/>
                <h1>Upload KMZ</h1>
                <div className="polygon-upload__buttons">
                    <input type="file" onChange={handleFileChange} accept=".kml, .kmz"/>
                    <button className={coordinates ? "upload_button" : "upload_button_disabled"} onClick={handleUpload} disabled={!coordinates}>
                        {!loading ? <TiUpload /> : "Loading..."}
                    </button>
                </div>


                {error && (
                    <div className="polygon-upload__error">
                        <p>{error}</p>
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

                            <div className="upload-menu-buttons">
                                <button type="submit">
                                    {loading? "Loading..." : <FiSave />}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PolygonUpload;

