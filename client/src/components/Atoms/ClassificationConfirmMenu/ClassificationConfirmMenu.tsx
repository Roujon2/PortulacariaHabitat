import React from "react";
import { useState } from "react";

import "./classificationConfirmMenu.css"
import { IoClose } from "react-icons/io5";

interface Props {
  onClose: () => void;
  onConfirm: (options: { exactArea: boolean; downloadUrl: boolean; filename?: string }) => void;
}

const ClassificationConfirmMenu: React.FC<Props> = ({ onClose, onConfirm }) => {
    const [exactAreaCalculation, setExactAreaCalculation] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(false);
    const [filename, setFilename] = useState("spekboom-classification");


    const handleConfirm = () => {
        onConfirm({ exactArea: exactAreaCalculation, downloadUrl, filename });
    };

  return (
    <div className="classification-confirm-overlay">
        <div className="classification-confirm-container">
            <div onClick={onClose}>
                            <IoClose className="close-button" />
            </div>
            <h2>Classification Options</h2>

            <div className="form-group">
                <label>
                    <input
                    type="checkbox"
                    checked={exactAreaCalculation}
                    onChange={(e) => setExactAreaCalculation(e.target.checked)}
                    />
                    Enable Exact Classification Area Calculation
                </label>
                {exactAreaCalculation && (
                    <p className="warning-text">
                    Exact classification area calculation can significantly slow down processing times for large polygons.
                    </p>
                )}
            </div>

            <div className="form-group">
                <label>
                    <input
                    type="checkbox"
                    checked={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.checked)}
                    />
                Retrieve Classification Download URL
                </label>
                {downloadUrl && (
                    <div className="filename-field">
                    <label>
                        Filename:
                        <input
                        type="text"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        placeholder="Enter filename"
                        />
                    </label>
                </div>
                )}
            </div>

            <div className="actions">
                <button className="classify-button" onClick={handleConfirm}>
                    Classify Polygon
                </button>
            </div>
        </div>
    </div>
  );
}


export default ClassificationConfirmMenu;