import { CampusLocation, AppSettings } from '../types';

export interface LocationValidationResult {
  isInside: boolean;
  distanceMeters: number;
  accuracyMeters?: number;
  userCoords?: { latitude: number; longitude: number };
  mode: 'demo' | 'gps';
  message: string;
}

/**
 * Calculates Great-Circle distance between two points on Earth using the Haversine formula.
 * Returns distance in meters.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Validates whether the student is within the permitted geofence of a class location.
 */
export async function validateClassGeofence(
  location: CampusLocation,
  settings: AppSettings
): Promise<LocationValidationResult> {
  const radius = settings.geofenceRadius || location.geofenceRadiusMeters || 80;

  // If Geofence is completely disabled in settings
  if (!settings.geofenceEnabled) {
    return {
      isInside: true,
      distanceMeters: 0,
      mode: 'demo',
      message: 'Geofencing check bypassed (disabled in settings).',
    };
  }

  // Demo Location Mode (Required for prototype testing)
  if (settings.demoLocationMode) {
    if (settings.simulatedLocationStatus === 'inside') {
      const simulatedDistance = Math.floor(Math.random() * (radius * 0.4)) + 5; // e.g. 15m away
      return {
        isInside: true,
        distanceMeters: simulatedDistance,
        accuracyMeters: 8,
        userCoords: {
          latitude: location.latitude + 0.00005,
          longitude: location.longitude + 0.00005,
        },
        mode: 'demo',
        message: 'Location verified (Simulated Demo GPS: Inside)',
      };
    } else {
      const simulatedDistance = radius + 140; // e.g. 220m away (e.g. outside canteen)
      return {
        isInside: false,
        distanceMeters: simulatedDistance,
        accuracyMeters: 12,
        userCoords: {
          latitude: location.latitude + 0.002,
          longitude: location.longitude + 0.002,
        },
        mode: 'demo',
        message: `You're outside the permitted class location (${simulatedDistance}m away, allowed radius is ${radius}m).`,
      };
    }
  }

  // Real Hardware GPS Check
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser/device.');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const distance = calculateHaversineDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude
        );

        const isInside = distance <= radius;
        const message = isInside
          ? `Location verified (${distance}m from ${location.name})`
          : `You're outside the permitted class location. You are ~${distance}m away (allowed within ${radius}m).`;

        resolve({
          isInside,
          distanceMeters: distance,
          accuracyMeters: accuracy,
          userCoords: { latitude, longitude },
          mode: 'gps',
          message,
        });
      },
      (error) => {
        let msg = 'Could not access location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow GPS access in your browser settings or switch to Demo Mode in Settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'The request to obtain your location timed out.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      }
    );
  });
}
