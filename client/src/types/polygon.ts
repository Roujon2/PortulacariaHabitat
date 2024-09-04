// Type for the custom polygon object for info display
export interface Polygon{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    coordinates: google.maps.LatLngLiteral[];
    tags: string[];
}