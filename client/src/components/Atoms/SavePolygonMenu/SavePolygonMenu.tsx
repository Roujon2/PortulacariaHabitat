import React, { useState } from "react";
import './savePolygonMenu.css';

import { TagsInput } from "react-tag-input-component";
import { IoClose } from "react-icons/io5";


// Property definition to be passed to SavePolygonMenu component
export interface SavePolygonMenuProps {
    onSave: (formData: {
        name: string;
        description: string;
        tags: string[];
        locality: string;
        ownershipType: string;
        notes: string;
        seriesName: string;
    }) => void;

    // On cancel
    onCancel: () => void;
}

// SavePolygonMenu component
const SavePolygonMenu: React.FC<SavePolygonMenuProps> = ({ onSave, onCancel }: SavePolygonMenuProps) => {
    // Menu variables
    const [polygonName, setPolygonName] = useState<string>("");
    const [polygonDescription, setPolygonDescription] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [locality, setLocality] = useState<string>("");
    const [ownershipType, setOwnershipType] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [seriesName, setSeriesName] = useState<string>("");

    // State var handling cancel state
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    // Function to handle save button click
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: polygonName,
            description: polygonDescription,
            tags: tags,
            locality: locality,
            ownershipType: ownershipType,
            notes: notes,
            seriesName: seriesName
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
                            Locality:
                            <input
                                type="text"
                                value={locality}
                                onChange={(e) => setLocality(e.target.value)}
                                required
                            />
                        </label>

                        <label className="menu-label">
                            Name:
                            <input
                                type="text"
                                value={polygonName}
                                onChange={(e) => setPolygonName(e.target.value)}
                                required
                            />
                        </label>

                        <label className="menu-label">
                            Description:
                            <textarea
                                value={polygonDescription}
                                onChange={(e) => setPolygonDescription(e.target.value)}
                                className="textarea"
                            />
                        </label>

                        <label className="menu-label">
                            Tags:
                            <TagsInput
                                value={tags}
                                onChange={setTags}
                                name="tags"
                                placeHolder="Add tags"
                                classNames={
                                    {
                                        input: "tags-input",
                                        tag: "tag",
                                        
                                    }
                                }
                            />
                        </label>

                        <label className="menu-label">
                            Ownership Type:
                            <input
                                type="text"
                                value={ownershipType}
                                onChange={(e) => setOwnershipType(e.target.value)}
                                required
                            />
                        </label>

                        <label className="menu-label">
                            Farm/Series Name:
                            <input
                                type="text"
                                value={seriesName}
                                onChange={(e) => setSeriesName(e.target.value)}
                                required
                            />
                        </label>

                        <label className="menu-label">
                            Notes/Observations:
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
                            <button type="submit">Save</button>
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
                        <button onClick={goBack}>Back</button>
                        <button onClick={confirmCancel}>Yes</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavePolygonMenu;