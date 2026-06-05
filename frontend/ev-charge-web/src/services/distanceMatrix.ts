/**
 * Distance Matrix Service
 *
 * Strategy:
 *  1. Try Google Distance Matrix API (real driving data)
 *  2. If API key not enabled / quota exceeded → auto-fallback to Haversine
 *     (straight-line × 1.3 = estimated driving distance, 30 km/h city speed)
 */

export interface DistanceResult {
    distance: string;   // e.g. "4.2 km"
    duration: string;   // e.g. "12 min"
    distanceValue: number; // raw metres
    durationValue: number; // raw seconds
    isMock: boolean;
}

/** Haversine formula – returns distance in metres */
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Earth radius in metres
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mockResult(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
): DistanceResult {
    const straight = haversine(originLat, originLng, destLat, destLng);
    const driving = straight * 1.35; // road factor
    const speedMps = 30 / 3.6; // 30 km/h city speed → m/s
    const durationSec = driving / speedMps;
    const km = (driving / 1000).toFixed(1);
    const min = Math.ceil(durationSec / 60);
    return {
        distance: `${km} km`,
        duration: `${min} min`,
        distanceValue: Math.round(driving),
        durationValue: Math.round(durationSec),
        isMock: true,
    };
}

export interface DestinationPoint {
    lat: number;
    lng: number;
    id: number | string;
}

export interface DistanceMatrixResults {
    [id: string]: DistanceResult;
}

/**
 * Calculates distance & duration from one origin to many destinations.
 * Falls back to Haversine mock automatically if the API is unavailable.
 */
export async function calculateDistances(
    originLat: number,
    originLng: number,
    destinations: DestinationPoint[]
): Promise<DistanceMatrixResults> {
    // No google SDK loaded yet → use mock immediately
    if (typeof google === 'undefined' || !google.maps) {
        return buildMock(originLat, originLng, destinations);
    }

    try {
        const service = new google.maps.DistanceMatrixService();
        const request: google.maps.DistanceMatrixRequest = {
            origins: [new google.maps.LatLng(originLat, originLng)],
            destinations: destinations.map(d => new google.maps.LatLng(d.lat, d.lng)),
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
        };

        const response = await service.getDistanceMatrix(request);
        const row = response.rows[0]?.elements;

        if (!row) return buildMock(originLat, originLng, destinations);

        const results: DistanceMatrixResults = {};
        destinations.forEach((dest, i) => {
            const el = row[i];
            if (el && el.status === 'OK' && el.distance && el.duration) {
                results[dest.id] = {
                    distance: el.distance.text,
                    duration: el.duration.text,
                    distanceValue: el.distance.value,
                    durationValue: el.duration.value,
                    isMock: false,
                };
            } else {
                results[dest.id] = mockResult(originLat, originLng, dest.lat, dest.lng);
            }
        });
        return results;
    } catch {
        // Distance Matrix API not enabled or quota hit → silent fallback
        return buildMock(originLat, originLng, destinations);
    }
}

function buildMock(
    originLat: number,
    originLng: number,
    destinations: DestinationPoint[]
): DistanceMatrixResults {
    const results: DistanceMatrixResults = {};
    destinations.forEach(dest => {
        results[dest.id] = mockResult(originLat, originLng, dest.lat, dest.lng);
    });
    return results;
}
