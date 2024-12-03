import React from "react";

import { FiSave } from "react-icons/fi";
import { IoMdDownload } from "react-icons/io";
import { MdOutlineExpandMore } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaLocationCrosshairs } from "react-icons/fa6";

import { IoMdMenu } from "react-icons/io";
import { RiLogoutBoxFill } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { PiPolygonDuotone } from "react-icons/pi";
import { MdHelp } from "react-icons/md";

import HoverText from "../../Atoms/HoverText/HoverText";

// Images
import NavBarHighlight from "../../../assets/images/HelpMenuImages/NavBarHighlight.png";
import PolygonDetailsHighlight from "../../../assets/images/HelpMenuImages/PolygonDetailsHighlight.png";


import './helpMenu.css'

// Help menu component
const HelpMenu = () => {
        return (
        <div className="help-menu-container">
            <h1 className="help-title">Help</h1>
            {/* Index at the top */}
            <div className="help-index">
                <h2>Index</h2>
                <div className="help-index-items">
                    <li>
                        <a href="#buttons-section" className="help-index-link">
                            Buttons Guide
                        </a>
                    </li>
                    <li>
                        <a href="#menus-section" className="help-index-link">
                            Sections Guide
                        </a>
                    </li>
                </div>
            </div>
    
            <div className="help-menu">

                {/* Buttons Section */}
                <div id="buttons-section" className="help-section">
                    <h2 className="help-title">Buttons Guide</h2>
                    <p className="help-description">
                    </p>
        
                    <div className="button-info">
                        <h3>Center</h3>
                        <div className="button-details">
                            <HoverText title="Center Button">
                                <span className="buttons-span">
                                    <button className="polygon-details__button-center">
                                        <FaLocationCrosshairs  />
                                    </button>
                                    
                                    <button className="polygon-details__button-center-disabled" disabled>
                                        <FaLocationCrosshairs  />
                                    </button>
                                </span>
                            </HoverText>

                            <p>Centers the selected polygon on the map. If the polygon is not on the map this button is disabled.</p>
                        </div>
                    </div>
        
                    <div className="button-info">
                        <h3>Add to Map</h3>
                        <div className="button-details">
                            <HoverText title="Add to map">
                                <span className="buttons-span">
                                    <button className="button-view-on-map">
                                        <FaMapLocationDot />
                                    </button>
                                    
                                    <button className="button-view-on-map-disabled" disabled>
                                        <FaMapLocationDot />
                                    </button>
                                </span>
                            </HoverText>

                            <p>Adds the selected polygon on the map. If no polygon is selected the button is disabled.</p>
                        </div>
                    </div>

                    <div className="button-info">
                        <h3>Remove from Map</h3>
                        <div className="button-details">
                            <HoverText title="Remove from map">
                                <span className="buttons-span">
                                    <button className="polygon-widget__button-remove-from-map">
                                        <FaMapLocationDot />
                                    </button>
                                </span>
                            </HoverText>

                            <p>Removes the selected polygon from the map. This does not delete the polygon from the app.</p>
                        </div>
                    </div>
        
                    <div className="button-info">
                        <h3>Delete</h3>
                        <div className="button-details">
                            <HoverText title="Delete polygon">
                                <span className="buttons-span">
                                    <button className="button-delete">
                                        <FaTrashCan />
                                    </button>
                                    
                                    <button className="button-delete-disabled" disabled>
                                        <FaTrashCan />
                                    </button>
                                </span>
                            </HoverText>

                            <p>Deletes the selected polygon from the app. This action is irreversible. If no polygon is selected the button is disabled.</p>
                        </div>
                    </div>

                    <div className="button-info">
                        <h3>Save Changes</h3>
                        <div className="button-details">
                            <HoverText title="Save changes">
                                <span className="buttons-span">
                                    <button className="polygon-details__button-save">
                                        <FiSave />
                                    </button>
                                    
                                    <button className="polygon-details__button-save-disabled" disabled>
                                        <FiSave />
                                    </button>
                                </span>
                            </HoverText>

                            <p>Saves the changes made to the polygon. If no changes have been made the button is disabled.</p>
                        </div>
                    </div>

                    <div className="button-info">
                        <h3>Load More Polygons</h3>
                        <div className="button-details">
                            <HoverText title="Load more polygons">
                                <span className="buttons-span">
                                    <button className="button-load-more">
                                        <MdOutlineExpandMore />
                                    </button>
                                    
                                    <button className="button-load-more-disabled" disabled>
                                        <MdOutlineExpandMore />
                                    </button>
                                </span>
                            </HoverText>

                            <p>Loads more polygons drawn by the user. If there are no more polygons to load the button is disabled.</p>
                        </div>
                    </div>

                    <div className="button-info">
                        <h3>Download Classification</h3>
                        <div className="button-details">
                            <HoverText title="Download classification">
                                <span className="buttons-span">
                                    <button className="polygon-details__button-download">
                                        <IoMdDownload />
                                    </button>
                                </span>
                            </HoverText>

                            <p>Downloads the classification image of the selected polygon if one has been made. The image is downloaded as a GeoTIFF zip with 3 files representing the RGB bands.</p>
                        </div>
                    </div>
                </div>

                {/* Menus Section */}
                <div id="menus-section" className="help-section">
                    <h2 className="help-title">Sections Guide</h2>
                    <p className="help-description">
                    This section provides a guide to the different components of the app, detailing their purpose and functionality.
                    </p>

                    <div className="app-section">
                        <h3 className="section-title">Navigation Bar</h3>
                        <div className="section-image-container">
                            <img
                                src={NavBarHighlight}
                                alt="Navigation Bar Screenshot"
                                className="section-image"
                            />
                        </div>
                        <p className="section-description">
                            The Navigation Bar provides access to key features of the app:
                        </p>
                        <ul className="section-functionalities">
                            <li><IoMdMenu className="item-collapse"/> Collapses and expands the sidebar.</li>
                            <li><MdAccountCircle /> Access your profile information.</li>
                            <li><PiPolygonDuotone /> Access your polygons.</li>
                            <li><MdHelp /> Access the help menu.</li>
                            <li><RiLogoutBoxFill className="logout-icon" /> Logout of the app.</li>
                        </ul>
                    </div>

                


                </div>


            </div>
        </div>
        );
};


export default HelpMenu;