// /app/api/places/route.ts
import { NextRequest, NextResponse } from 'next/server';

type GoogleNearbyResponse = {
	results?: GooglePlace[];
	status: string;
	error_message?: string;
};

type GooglePlace = {
	place_id?: string;
	name?: string;
	geometry?: { location?: { lat?: number; lng?: number } };
	vicinity?: string;
	rating?: number;
	opening_hours?: { open_now?: boolean };
};

const BASE = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

function getPlacesKey(): string | undefined {
	return (
		process.env.GOOGLE_PLACES_API_KEY ||
		process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
	);
}

async function nearbySearch(
	lat: string,
	lng: string,
	query: string,
	apiKey: string
): Promise<GoogleNearbyResponse> {
	const url = `${BASE}?location=${lat},${lng}&${query}&key=${apiKey}`;
	const res = await fetch(url);
	return res.json();
}

/**
 * Legacy Nearby Search: `rankby=distance` + `keyword` often returns ZERO_RESULTS
 * even when `radius` + the same keyword returns many places. We use radius-based
 * queries, merge, dedupe by place_id, and the client sorts by distance.
 */
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const lat = searchParams.get('lat');
	const lng = searchParams.get('lng');

	if (!lat || !lng) {
		return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
	}

	const apiKey = getPlacesKey();
	if (!apiKey) {
		return NextResponse.json(
			{
				status: 'REQUEST_DENIED',
				error_message:
					'Missing GOOGLE_PLACES_API_KEY or NEXT_PUBLIC_GOOGLE_PLACES_API_KEY',
				results: [],
			},
			{ status: 500 }
		);
	}

	const radiusM = 12000;
	const strategies = [
		`radius=${radiusM}&keyword=clinic`,
		`radius=${radiusM}&keyword=klinik`,
		`radius=${radiusM}&type=doctor`,
		`radius=${radiusM}&type=hospital`,
	];

	const seen = new Set<string>();
	const merged: GooglePlace[] = [];
	let lastStatus = 'ZERO_RESULTS';
	let lastError: string | undefined;

	try {
		for (const q of strategies) {
			const data = await nearbySearch(lat, lng, q, apiKey);
			lastStatus = data.status;
			if (data.error_message) lastError = data.error_message;

			if (data.status === 'REQUEST_DENIED' || data.status === 'INVALID_REQUEST') {
				return NextResponse.json({
					results: merged,
					status: data.status,
					error_message: data.error_message,
				});
			}

			for (const place of data.results || []) {
				const id = place.place_id;
				if (!id || seen.has(id)) continue;
				seen.add(id);
				merged.push(place);
			}

			if (merged.length >= 18) break;
		}

		return NextResponse.json({
			results: merged,
			status: merged.length > 0 ? 'OK' : lastStatus,
			...(merged.length === 0 && lastError ? { error_message: lastError } : {}),
		});
	} catch (error) {
		console.error('Google Places Error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch places', results: [], status: 'ERROR' },
			{ status: 500 }
		);
	}
}
