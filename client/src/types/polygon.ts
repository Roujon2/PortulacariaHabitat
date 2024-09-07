// Type for the custom polygon object for info display
export interface NewPolygon{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    coordinates: google.maps.LatLngLiteral[];
    tags: string[];
}

// Type for polygon after it is saved to database and retrieved an id
export interface Polygon extends NewPolygon{
    id: number;
}