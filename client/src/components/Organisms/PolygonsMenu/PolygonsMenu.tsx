import React from "react";

import './polygonsMenu.css'
import { Polygon, NewPolygon } from "../../../types/polygon";

import PolygonCard from "../../Atoms/PolygonCard/PolygonCard";
import { useEffect } from 'react';

import { usePolygonContext } from "../../../contexts/PolygonContext";

import polygonApi from "../../../api/polygonApi";

const polygonLimit = 10;

// Polygons menu component
const PolygonsMenu: React.FC = () => {
    const { polygons, loading, loadMorePolygons } = usePolygonContext();

    const handleLoadMore = async () => {
        loadMorePolygons();
    }

    return (
        <div className='polygons-menu'>
            <h1>Polygons Menu</h1>
            <div className='polygons-menu__cards'>
                {polygons.map((polygon: Polygon) => (
                    <PolygonCard key={polygon.id} polygon={polygon} />
                ))}
            </div>
            <button className='polygons-menu__load-more' onClick={handleLoadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load more'}
            </button>
        </div>
    );
};

export default PolygonsMenu;