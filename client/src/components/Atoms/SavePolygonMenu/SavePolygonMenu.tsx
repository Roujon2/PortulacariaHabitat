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

    // Function to handle save button click
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: polygonName,
            description: polygonDescription,
            tags: tags
        });
    }

    return (
        <div className="save-polygon-menu-container">
            <div onClick={onCancel}><IoClose className="close-button"/></div>
            <h3>Polygon Details</h3>
            <form className="menu-fields" onSubmit={handleSave}>

                <label className="menu-label">
                    Name:
                    <input type="text" value={polygonName} onChange={(e) => setPolygonName(e.target.value)} required />
                </label>

                <label className="menu-label">
                    Description:
                    <textarea value={polygonDescription} onChange={(e) => setPolygonDescription(e.target.value)}  />
                </label>

                <label className="menu-label">
                    Tags:
                    <TagsInput
                        value={tags}
                        onChange={setTags}
                        name="tags"
                        placeHolder="Add tags"
                    />
                </label>

                <div className="menu-buttons">
                    <button onClick={onCancel}>Cancel</button>
                    <button type="submit">Save</button>
                </div>
            

            </form>
        </div>
    );
};

export default SavePolygonMenu;