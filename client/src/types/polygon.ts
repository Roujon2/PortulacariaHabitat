// Type for the custom polygon object for info display
export interface NewPolygon{
    name: string;
    description: string;
    coordinates: google.maps.LatLngLiteral[];
    locality: string;
    ownership_type: string;
    farm_series_name: string;
    notes: string;
    classified: boolean;
}

// Type for polygon after it is saved to database and retrieved an id
export interface Polygon extends NewPolygon{
    id: number;
    created_at: string;
    updated_at: string;
}
