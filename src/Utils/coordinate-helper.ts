


// calculate distance from an array of lat/long coordinates
export function calculateDistance(coordinates: Array<{Latitude: number, Longitude: number}>) {
    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
        const lat1 = coordinates[i].Latitude;
        const lon1 = coordinates[i].Longitude;
        const lat2 = coordinates[i + 1].Latitude;
        const lon2 = coordinates[i + 1].Longitude;
        totalDistance += distanceBetweenPoints(lat1, lon1, lat2, lon2);
    }
    return totalDistance;
}


// calculate the distance between two lat/long points
function distanceBetweenPoints(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 3956; // Radius of the earth in miles
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in mils
    return d;
}

// convert degrees to radians
function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}