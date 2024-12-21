import React, {useRef} from "react";


import ButtonHelpSection from "../../Atoms/ButtonHelpSection/ButtonHelpSection";
import PolygonDrawingHelpSection from "../../Atoms/PolygonDrawingHelpSection/PolygonDrawingHelpSection";

import './helpMenu.css'
import { TbSectionSign } from "react-icons/tb";
import PolygonUploadHelpSection from "../../Atoms/PolygonUploadHelpSection/PolygonUploadHelpSection";
import PolygonClassificationHelpSection from "../../Atoms/PolygonClassificationHelpSection/PolygonClassificationHelpSection";

// Help menu component
const HelpMenu = () => {
    const [currentSection, setCurrentSection] = React.useState("buttons-section");
    const sectionRef = useRef<HTMLDivElement>(null);

    const sections = [
        {id: "buttons-section", title: "Buttons Guide"},
        {id: "polygon-drawing-section", title: "Drawing a Polygon"},
        {id: "polygon-upload-section", title: "Uploading a Polygon"},
        {id: "polygon-classification-section", title: "Classifying a Polygon"}
    ];

    const handleSectionChange = (sectionId: string) => {
        setCurrentSection(sectionId);
        // Add to history #
        window.location.hash = sectionId;
        // Scroll up 
        sectionRef.current?.scrollTo(0, 0);
    };

    // Get current section index
    const currentIndex = sections.findIndex(section => section.id === currentSection);
    const nextSection = sections[currentIndex + 1] ? sections[currentIndex + 1].id : null;

    const renderSection = () => {
        switch (currentSection) {
            case "buttons-section":
                return <ButtonHelpSection />;
            case "polygon-drawing-section":
                return <PolygonDrawingHelpSection />;
            case "polygon-upload-section":
                return <PolygonUploadHelpSection />;
            case "polygon-classification-section":
                return <PolygonClassificationHelpSection />;
            default:
                return <ButtonHelpSection />;
        }
    };

        return (
        <div className="help-menu-container">
            <h1 className="help-title">Help</h1>
            {/* Index at the top */}
            <div className="help-index">
                <h2>Index</h2>
                <div className="help-index-items">
                    {sections.map((section) => (
                        <li key={section.id}>
                            <a href={`#${section.id}`} 
                                className={`help-index-link ${currentSection === section.id ? "active" : ""}`}
                                onClick={() => handleSectionChange(section.id)}>
                                {section.title}
                            </a>
                        </li>
                    ))}
                </div>
            </div>
    
            <div className="help-menu" ref={sectionRef}>
                {/* Render selection section */}
                {renderSection()}

                {/* Next section button */}
                {nextSection && (
                    <button className="help-next-button" onClick={() => handleSectionChange(nextSection)}>
                        <span>Up Next</span>
                        <h3>{sections.find(section => section.id === nextSection)?.title}</h3>
                    </button>
                )}
            </div>
        </div>
        );
};


export default HelpMenu;