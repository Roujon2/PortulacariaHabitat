// Type for the custom polygon object for info display
export interface NewPolygon{
    name: string;
    description: string;
    coordinates: google.maps.LatLngLiteral[];
    locality: string;
    ownershipType: string;
    seriesName: string;
    notes: string;
}

// Type for polygon after it is saved to database and retrieved an id
export interface Polygon extends NewPolygon{
    id: number;
    created: string;
}
