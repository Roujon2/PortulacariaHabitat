import React, { useEffect, useState } from 'react';
import { usePolygonContext } from '../../../contexts/PolygonContext';
import './polygonWidget.css';

import { Polygon } from '../../../types/polygon';
import { FaLocationCrosshairs, FaMapLocationDot } from 'react-icons/fa6';
import HoverText from '../HoverText/HoverText';




interface PolygonWidgetProps {
    opacity: number;
    handleOpacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveFromMap: () => void;
}

const PolygonWidget: React.FC<PolygonWidgetProps> = ({ opacity, handleOpacityChange,  handleRemoveFromMap}) => {
    const { selectedPolygonDetailsId, polygonsOnMap, setCenterOnPolygons, polygonResultsOnMap } = usePolygonContext();
    const [selectedPolygon, setSelectedPolygon] = useState<Polygon | null>(null);

    useEffect(() => {
        if (selectedPolygonDetailsId) {
            const polygon = polygonsOnMap.find(p => p.id === selectedPolygonDetailsId);
            setSelectedPolygon(polygon || null);
        } else {
            setSelectedPolygon(null);
        }
    }, [selectedPolygonDetailsId, polygonsOnMap, polygonResultsOnMap]);


    return (
        selectedPolygon && (
            <div className="polygon-widget">
                <h2 className='polygon-widget__polygon-name'>{selectedPolygon.name}</h2>

            {opacity >= 0 && opacity <= 1 && (<div className="overlay-opacity-slider">
                    <label>Opacity</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={opacity}
                        onChange={handleOpacityChange}
                    />
                </div>)}

                <div className="polygon-widget__buttons">
                    <HoverText title="Center on map">
                        <span>
                            <button className={'polygon-widget__button-center'} onClick={() => setCenterOnPolygons([selectedPolygon])} >
                                <FaLocationCrosshairs />
                            </button>
                        </span>
                    </HoverText>

                    <HoverText title="Remove from map">
                        <span>
                                <button 
                                onClick={handleRemoveFromMap} 
                                className={'polygon-widget__button-remove-from-map'}
                            >
                                <FaMapLocationDot />
                            </button> 
                        </span>
                    </HoverText>
                </div>
            </div>
        )
    );
};

export default PolygonWidget;
