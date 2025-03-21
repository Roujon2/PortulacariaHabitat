import React, { useState } from "react";
import './savePolygonMenu.css';

import { IoClose } from "react-icons/io5";

import { RiArrowGoBackLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { FiSave } from "react-icons/fi";




// Property definition to be passed to SavePolygonMenu component
export interface SavePolygonMenuProps {
    onSave: (formData: {
        name: string;
        description: string;
        locality: string;
        ownership_type: string;
        notes: string;
        farm_series_name: string;
    }) => void;

    // On cancel
    onCancel: () => void;
}

// SavePolygonMenu component
const SavePolygonMenu: React.FC<SavePolygonMenuProps> = ({ onSave, onCancel }: SavePolygonMenuProps) => {
    // Menu variables
    const [polygonName, setPolygonName] = useState<string>("");
    const [polygonDescription, setPolygonDescription] = useState<string>("");
    const [locality, setLocality] = useState<string>("");
    const [ownership_type, setOwnershipType] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [farm_series_name, setSeriesName] = useState<string>("");

    // State var handling cancel state
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    // Function to handle save button click
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: polygonName,
            description: polygonDescription,
            locality: locality,
            ownership_type: ownership_type,
            notes: notes,
            farm_series_name: farm_series_name
        });
    }

    // Function to handle cancel button click
    const handleCancel = () => {
        // Show confirmation dialog
        setShowConfirmation(true);
    };

    // Function to confirm the cancellation
    const confirmCancel = () => {
        onCancel();
    };

    // Function to go back to the form without canceling
    const goBack = () => {
        setShowConfirmation(false);
    };

    return (
        <div className="save-polygon-menu-container">
            {!showConfirmation ? (
                <>
                    <div onClick={handleCancel}>
                        <IoClose className="close-button" />
                    </div>
                    <h3>Polygon Details</h3>
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
                            <button type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button type="submit" className="polygon-details__button-save"><FiSave /></button>
                        </div>
                    </form>
                </>
            ) : (
                <div className="confirmation-dialog">
                    <div className="confirmation-header">
                        <h4>Are you sure you want to cancel?</h4>
                        <h5>All changes will be lost</h5>
                    </div>
                    <div className="confirmation-buttons">
                        <button type="button" onClick={goBack}>
                            <RiArrowGoBackLine />
                        </button>
                        <button onClick={confirmCancel}>
                            <FaCheck />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavePolygonMenu;