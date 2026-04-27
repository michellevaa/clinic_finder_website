'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { Library } from '@googlemaps/js-api-loader';
import {
	GoogleMap,
	InfoWindow,
	Marker,
	useJsApiLoader,
} from '@react-google-maps/api';
import { FiMap, FiMapPin, FiSearch } from 'react-icons/fi';
import { HospitalCard } from './HospitalCard';
import { useUserLocation } from '../hooks/useUserLocation';
import { useHospitalData } from '../hooks/useHospitalData';

const containerStyle = {
	width: '100%',
	height: '100%',
};

type MapsProps = {
	overrideLocation?: { lat: number; lng: number } | null;
	onLocationSelect: (coords: { lat: number; lng: number }) => void;
};

type FilterMode = 'all' | 'open' | 'top-rated';

const Maps: React.FC<MapsProps> = ({ overrideLocation, onLocationSelect }) => {
	const location = useUserLocation(overrideLocation);
	const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
	const { clinics, loading } = useHospitalData(location, mapInstance);
	const [selectedClinic, setSelectedClinic] = useState<number | null>(null);
	const [filterMode, setFilterMode] = useState<FilterMode>('all');
	const [query, setQuery] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const mapRef = useRef<google.maps.Map | null>(null);
	const prevClinicCount = useRef(0);

	const libraries = useMemo<Library[]>(() => ['places'], []);

	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
		libraries,
	});

	const locationKey = location
		? `${location.lat.toFixed(6)},${location.lng.toFixed(6)}`
		: '';

	useEffect(() => {
		setSelectedClinic(null);
		prevClinicCount.current = 0;
	}, [locationKey]);

	const filteredClinics = useMemo(() => {
		if (filterMode === 'open') {
			return clinics.filter((clinic) => clinic.open);
		}

		if (filterMode === 'top-rated') {
			return [...clinics]
				.filter((clinic) => clinic.rating != null)
				.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
		}

		return clinics;
	}, [clinics, filterMode]);

	useEffect(() => {
		if (filteredClinics.length > 0 && prevClinicCount.current === 0) {
			setSelectedClinic(0);
		}
		prevClinicCount.current = filteredClinics.length;
	}, [filteredClinics]);

	useEffect(() => {
		if (!mapRef.current || !location || loading || filteredClinics.length === 0) return;
		const bounds = new google.maps.LatLngBounds();
		bounds.extend(location);
		filteredClinics.forEach((clinic) =>
			bounds.extend({ lat: clinic.lat, lng: clinic.lng })
		);
		mapRef.current.fitBounds(bounds, 52);
	}, [locationKey, loading, filteredClinics, location]);

	const onMapLoad = useCallback((map: google.maps.Map) => {
		mapRef.current = map;
		setMapInstance(map);
	}, []);

	const clinicMarkerSymbol = (selected: boolean): google.maps.Symbol => ({
		path: google.maps.SymbolPath.CIRCLE,
		scale: selected ? 13 : 11,
		fillColor: selected ? '#2955d9' : '#5d74ff',
		fillOpacity: 1,
		strokeColor: '#ffffff',
		strokeWeight: 2,
	});

	const selectedClinicData =
		selectedClinic !== null ? filteredClinics[selectedClinic] : null;

	const runSearch = async (searchTerm: string) => {
		if (!searchTerm) return;

		setIsSearching(true);

		try {
			const res = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
					searchTerm
				)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
			);
			const data = await res.json();
			const nextLocation = data?.results?.[0]?.geometry?.location;

			if (nextLocation) {
				setQuery(searchTerm);
				onLocationSelect({ lat: nextLocation.lat, lng: nextLocation.lng });
			} else {
				alert('Location not found. Try a more specific area or hospital name.');
			}
		} catch (error) {
			console.error('Error geocoding location:', error);
			alert('We could not search that location right now.');
		} finally {
			setIsSearching(false);
		}
	};

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		await runSearch(query.trim());
	};

	return (
		<section id="find-clinic" className="px-3 pb-4 pt-3">
			<div className="overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,#fdfefe_0%,#eef4ff_100%)] shadow-[0_28px_70px_rgba(26,43,78,0.16)]">
				<div className="border-b border-slate-200/70 px-4 pb-4 pt-4">
					<div className="flex items-start justify-between gap-3">
						<div>
							<p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
								Map results
							</p>
							<h1 className="mt-2 text-[1.65rem] leading-tight text-slate-950">
								Nearby clinics and hospitals
							</h1>
						</div>
						<div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
							<FiMap className="text-xl" />
						</div>
					</div>

					<form onSubmit={handleSearch} className="mt-4">
						<label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
							<FiSearch className="shrink-0 text-lg text-blue-600" />
							<input
								type="search"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
								placeholder="Search area, hospital, or clinic"
							/>
							<button
								type="submit"
								disabled={isSearching}
								className="rounded-xl bg-[linear-gradient(135deg,#2955d9,#4f83ff)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-70"
							>
								{isSearching ? '...' : 'Go'}
							</button>
						</label>
					</form>

					<div className="mt-4 flex flex-wrap gap-2">
						<div className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-700">
							{overrideLocation ? 'Showing searched area' : 'Using current location'}
						</div>
						<div className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm">
							{filteredClinics.length} result{filteredClinics.length === 1 ? '' : 's'}
						</div>
					</div>
				</div>

				<div className="p-3">
					<div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-4 shadow-sm">
						<div className="mb-4 flex items-center justify-between gap-3">
							<div>
								<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
									Results
								</p>
								<h2 className="mt-1 text-xl text-slate-950">Closest places first</h2>
							</div>
							<div className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600">
								{filterMode === 'all'
									? 'Tap for preview'
									: filterMode === 'open'
										? 'Open now'
										: 'Top rated'}
							</div>
						</div>

						<div className="mb-3 flex flex-nowrap gap-1.5">
							{[
								{ key: 'all', label: 'All nearby' },
								{ key: 'open', label: 'Open now' },
								{ key: 'top-rated', label: 'Top rated' },
							].map((option) => (
								<button
									key={option.key}
									type="button"
									onClick={() => setFilterMode(option.key as FilterMode)}
									className={`min-w-0 flex-1 rounded-full px-2 py-1 text-[8px] font-semibold leading-none transition ${
										filterMode === option.key
											? 'bg-blue-600 text-white shadow-md shadow-blue-200/50'
											: 'border border-slate-200 bg-white text-slate-700'
									}`}
								>
									{option.label}
								</button>
							))}
						</div>

						{loading && (
							<p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
								Building the nearby care list...
							</p>
						)}

						{!loading && filteredClinics.length === 0 && mapInstance && (
							<p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm leading-7 text-slate-600">
								No clinics matched this filter for this area. Try another filter or
								search a nearby town, suburb, or hospital name.
							</p>
						)}

						<div className="max-h-[420px] overflow-y-auto pr-1">
							{filteredClinics.map((clinic, index) => (
								<div
									key={`${clinic.lat},${clinic.lng},${clinic.name}`}
									onClick={() => setSelectedClinic(index)}
									className="cursor-pointer"
								>
									<HospitalCard
										hospital={clinic}
										selected={selectedClinic === index}
										isNearest={index === 0}
										onPreview={() => setSelectedClinic(index)}
									/>
								</div>
							))}
						</div>
					</div>

					<div className="mt-3 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
						<div className="mb-3 flex items-center justify-between gap-3 text-white">
							<div>
								<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
									Live map
								</p>
								<p className="mt-1 text-sm font-semibold">
									Tap a marker or card to preview
								</p>
							</div>
							<div className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-slate-200">
								{filteredClinics.length} shown
							</div>
						</div>

						<div className="h-[340px] overflow-hidden rounded-[1.35rem] bg-white">
							{loadError ? (
								<div className="flex h-full items-center justify-center bg-rose-50 p-8 text-center text-rose-700">
									<div>
										<p className="text-base font-semibold">The map could not be loaded.</p>
										<p className="mt-2 text-sm text-rose-600">
											Check the Google Maps API key and Places API access.
										</p>
									</div>
								</div>
							) : !isLoaded || !location ? (
								<div className="flex h-full items-center justify-center bg-white/90">
									<div className="flex flex-col items-center gap-4">
										<div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
										<p className="text-sm font-medium text-slate-600">Loading care map...</p>
									</div>
								</div>
							) : (
								<GoogleMap
									mapContainerStyle={containerStyle}
									center={location}
									zoom={13}
									onLoad={onMapLoad}
									options={{
										mapTypeControl: false,
										streetViewControl: false,
										fullscreenControl: false,
										zoomControl: true,
									}}
								>
									<Marker
										position={location}
										label={overrideLocation ? undefined : 'You'}
										title={overrideLocation ? 'Searched location' : 'Your current location'}
										icon={{
											url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
											scaledSize: new window.google.maps.Size(40, 40),
										}}
										zIndex={999}
									/>

									{filteredClinics.map((clinic, index) => (
										<Marker
											key={`${clinic.lat},${clinic.lng},${clinic.name}`}
											position={{ lat: clinic.lat, lng: clinic.lng }}
											onClick={() => setSelectedClinic(index)}
											icon={clinicMarkerSymbol(selectedClinic === index)}
											label={{
												text: `${index + 1}`,
												color: '#ffffff',
												fontSize: '10px',
												fontWeight: 'bold',
											}}
											title={clinic.name}
											zIndex={selectedClinic === index ? 100 : 1}
										/>
									))}

									{selectedClinicData && (
										<InfoWindow
											position={{
												lat: selectedClinicData.lat,
												lng: selectedClinicData.lng,
											}}
											onCloseClick={() => setSelectedClinic(null)}
										>
											<div className="max-w-[220px] pr-6 text-slate-900">
												<p className="font-semibold">{selectedClinicData.name}</p>
												{selectedClinicData.vicinity && (
													<p className="mt-1 text-xs text-slate-500">
														{selectedClinicData.vicinity}
													</p>
												)}
											</div>
										</InfoWindow>
									)}
								</GoogleMap>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Maps;
