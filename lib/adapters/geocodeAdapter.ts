import { GeocodeResult } from '../types';

export function requestCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
}> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      // Fallback to Anna Nagar, Chennai
      return resolve({ latitude: 13.085, longitude: 80.2101, accuracy: 15 });
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
      },
      (err) => {
        console.warn('Geolocation denied or timeout, using Chennai default', err);
        // Fallback to Anna Nagar, Chennai
        resolve({ latitude: 13.085, longitude: 80.2101, accuracy: 50 });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}

export async function reverseGeocodeLocation(
  latitude: number,
  longitude: number
): Promise<GeocodeResult> {
  // Approximate matching for Chennai localities
  let locality = 'Anna Nagar';
  let ward = 'Ward 102';

  if (latitude < 12.98) {
    locality = 'Tambaram';
    ward = 'Ward 201';
  } else if (latitude < 13.01 && longitude > 80.25) {
    locality = 'Besant Nagar';
    ward = 'Ward 176';
  } else if (latitude < 13.02) {
    locality = 'Adyar';
    ward = 'Ward 173';
  } else if (latitude < 13.05 && longitude < 80.24) {
    locality = 'T. Nagar';
    ward = 'Ward 136';
  } else if (longitude > 80.25) {
    locality = 'Royapettah';
    ward = 'Ward 111';
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      { headers: { 'User-Agent': 'Nagar360-Civic-App' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      return {
        address: data.display_name || `${locality}, Chennai`,
        locality: addr.suburb || addr.neighbourhood || locality,
        ward,
        city: addr.city || addr.town || 'Chennai',
        district: addr.state_district || 'Chennai',
        state: addr.state || 'Tamil Nadu',
        pincode: addr.postcode || '600040',
      };
    }
  } catch {
    // Fallback if network offline
  }

  return {
    address: `Near Main Road, ${locality}, Chennai`,
    locality,
    ward,
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
  };
}
