import React from "react";

import './polygonsMenu.css'
import { Polygon } from "../../../types/polygon";

import PolygonCard from "../../Atoms/PolygonCard/PolygonCard";

// Polygons menu component
const PolygonsMenu: React.FC = () => {
    const polygonData: Polygon = {
        name: "Sample Polygon",
        description: "This is a sample polygon with negative coordinates.",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        coordinates: [
          { lat: -800, lng: -500 },
            { lat: -600, lng: 500 },
            { lat: -300, lng: 500 },
            { lat: 500, lng: -2000 },
        ],
        tags: ["Example", "Polygon", "Demo"],
      };

    return (
        <div className='polygons-menu'>
            <h1>Polygons Menu</h1>
            <p>Polygons content goes here...</p>
            <PolygonCard polygon={polygonData} />
        </div>
    );
};

export default PolygonsMenu;