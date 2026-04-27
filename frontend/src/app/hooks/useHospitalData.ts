// hooks/useHospitalData.ts
import { useEffect, useState } from 'react';
import { Hospital } from '../components/HospitalCard';
import { getEmergencyDisplayCode } from '../utils/getEmergencyDisplayCode';
import { EMERGENCY_SYNC_EVENT } from '../lib/emergencySyncEvent';

interface AddressComponent {
	long_name: string;
	short_name: string;
	types: string[];
}

interface GeocodeResult {
	address_components: AddressComponent[];
}

interface GeocodeResponse {
	results: GeocodeResult[];
}

function distanceKm(
	a: { lat: number; lng: number },
	b: { lat: number; lng: number }
): number {
	const R = 6371;
	const toRad = (d: number) => (d * Math.PI) / 180;
	const dLat = toRad(b.lat - a.lat);
	const dLng = toRad(b.lng - a.lng);
	const lat1 = toRad(a.lat);
	const lat2 = toRad(b.lat);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function nearbySearchAsync(
	service: google.maps.places.PlacesService,
	request: google.maps.places.PlaceSearchRequest
): Promise<google.maps.places.PlaceResult[]> {
	return new Promise((resolve) => {
		service.nearbySearch(request, (results, status) => {
			if (
				status === google.maps.places.PlacesServiceStatus.OK &&
				results
			) {
				resolve(results);
			} else {
				if (
					status &&
					status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS
				) {
					console.warn('Places nearbySearch:', status);
				}
				resolve([]);
			}
		});
	});
}

function placeResultToHospital(
	place: google.maps.places.PlaceResult,
	origin: { lat: number; lng: number }
): Hospital | null {
	const loc = place.geometry?.location;
	if (!loc) return null;
	const latLng = loc as google.maps.LatLng;
	const lat = latLng.lat();
	const lng = latLng.lng();
	const oh = place.opening_hours as
		| { open_now?: boolean }
		| undefined;
	return {
		name: place.name ?? 'Unknown',
		lat,
		lng,
		vicinity: place.vicinity,
		rating: place.rating,
		open: oh?.open_now,
		distanceKm: distanceKm(origin, { lat, lng }),
	};
}

async function fetchNearbyClinicsClient(
	map: google.maps.Map,
	origin: { lat: number; lng: number }
): Promise<Hospital[]> {
	const service = new google.maps.places.PlacesService(map);
	const latLng = new google.maps.LatLng(origin.lat, origin.lng);
	const radius = 12000;

	const requests: google.maps.places.PlaceSearchRequest[] = [
		{ location: latLng, radius, keyword: 'clinic' },
		{ location: latLng, radius, keyword: 'klinik' },
		{ location: latLng, radius, type: 'doctor' },
		{ location: latLng, radius, type: 'hospital' },
	];

	const seen = new Set<string>();
	const merged: Hospital[] = [];

	for (const req of requests) {
		const results = await nearbySearchAsync(service, req);
		for (const place of results) {
			const id = place.place_id;
			if (!id || seen.has(id)) continue;
			seen.add(id);
			const h = placeResultToHospital(place, origin);
			if (h) merged.push(h);
		}
		if (merged.length >= 20) break;
	}

	merged.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
	return merged;
}

async function syncEmergency(location: { lat: number; lng: number }) {
	const geoRes = await fetch(
		`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
	);
	const geoData: GeocodeResponse = await geoRes.json();

	const countryComponent = geoData.results
		.flatMap((res: GeocodeResult) => res.address_components)
		.find((comp: AddressComponent) => comp.types.includes('country'));

	const countryCode = countryComponent?.short_name;

	if (countryCode) {
		localStorage.setItem('emergencyCountryCode', countryCode);
		try {
			const emerRes = await fetch(`/api/emergency?code=${countryCode}`);
			const emerData = await emerRes.json();
			if (emerData.data) {
				const formatted = getEmergencyDisplayCode(emerData.data);
				localStorage.setItem('emergencyNumber', formatted);
			}
		} catch {
			/* keep country code; emergency string may be empty */
		}
		window.dispatchEvent(new Event(EMERGENCY_SYNC_EVENT));
	}
}

/**
 * Loads clinics via the Maps JavaScript Places library (browser).
 * This matches referrer-restricted API keys; server-side /api/places often gets REQUEST_DENIED.
 */
export const useHospitalData = (
	location: { lat: number; lng: number } | null,
	map: google.maps.Map | null
): { clinics: Hospital[]; loading: boolean } => {
	const [clinics, setClinics] = useState<Hospital[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!location) return;

		let cancelled = false;

		const run = async () => {
			setClinics([]);
			setLoading(true);

			try {
				await syncEmergency(location);
				if (cancelled) return;

				if (!map) {
					return;
				}

				const list = await fetchNearbyClinicsClient(map, location);
				if (!cancelled) setClinics(list);
			} catch (error) {
				console.error('Error loading clinic data:', error);
			} finally {
				if (!cancelled) {
					if (map) setLoading(false);
				}
			}
		};

		void run();

		return () => {
			cancelled = true;
		};
	}, [location, map]);

	return { clinics, loading };
};
