import React, { useState } from "react";
import './savePolygonMenu.css';

// Property definition to be passed to SavePolygonMenu component
export interface SavePolygonMenuProps {
    onSave: (formData: {
        name: string;
        description: string;
        startDate: string;
        endDate: string;
    }) => void;
}

// SavePolygonMenu component
const SavePolygonMenu: React.FC<SavePolygonMenuProps> = ({ onSave }: SavePolygonMenuProps) => {
    // Menu variables
    const [polygonName, setPolygonName] = useState<string>("");
    const [polygonDescription, setPolygonDescription] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    // Function to handle save button click
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: polygonName,
            description: polygonDescription,
            startDate,
            endDate,
        });
    }

    return (
        <div className="save-polygon-menu-container">
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
                    Start Date:
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required/>
                </label>

                <label className="menu-label">
                    End Date:
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required/>
                </label>

                <button type="submit">Save</button>

            </form>
        </div>
    );
};

export default SavePolygonMenu;