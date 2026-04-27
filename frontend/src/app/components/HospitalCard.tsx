'use client';
import React from 'react';
import { FaRegStar } from 'react-icons/fa6';
import {
	FiArrowUpRight,
	FiClock,
	FiMapPin,
	FiNavigation,
	FiStar,
} from 'react-icons/fi';

export interface Hospital {
	name: string;
	lat: number;
	lng: number;
	vicinity?: string;
	rating?: number;
	open?: boolean;
	/** Straight-line distance from the search / map center, km */
	distanceKm?: number;
}

export function HospitalCard({
	hospital,
	selected,
	isNearest,
	onPreview,
}: {
	hospital: Hospital;
	selected?: boolean;
	isNearest?: boolean;
	onPreview?: () => void;
}) {
	const openDirections = (e: React.MouseEvent) => {
		e.stopPropagation();
		const dest = `${hospital.lat},${hospital.lng}`;
		window.open(
			`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`,
			'_blank',
			'noopener,noreferrer'
		);
	};

	return (
		<div
			className={`mb-4 flex w-full max-w-full flex-col items-start rounded-[1.75rem] border p-5 shadow-sm transition-all duration-200 ${
				selected
					? 'border-blue-400 bg-[linear-gradient(180deg,#ffffff_0%,#f2f7ff_100%)] shadow-xl shadow-blue-200/40 ring-2 ring-blue-500/10'
					: 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md'
			}`}
		>
			<div className="flex w-full items-start justify-between gap-4">
				<div className="min-w-0 flex-1">
					<div className="mb-2 flex flex-wrap items-center gap-2">
						{isNearest && (
							<span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
								Closest match
							</span>
						)}
						{hospital.open !== undefined && (
							<span
								className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
									hospital.open
										? 'bg-emerald-50 text-emerald-700'
										: 'bg-rose-50 text-rose-600'
								}`}
							>
								{hospital.open ? 'Open now' : 'Closed'}
							</span>
						)}
					</div>

					<h6 className="text-base font-semibold leading-snug text-slate-900">
						{hospital.name}
					</h6>
					{hospital.vicinity && (
						<div className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
							<FiMapPin className="mt-0.5 shrink-0 text-sm text-blue-600" />
							<span>{hospital.vicinity}</span>
						</div>
					)}

					<div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
						{hospital.distanceKm != null && (
							<div className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
								{hospital.distanceKm.toFixed(1)} km away
							</div>
						)}
						<div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
							<FiClock className="text-sm" />
							Live map result
						</div>
					</div>
				</div>

				<div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
					<FiStar className="text-lg" />
				</div>
			</div>

			<div className="mt-5 flex w-full items-center justify-between gap-3">
				<div className="flex min-h-10 items-center gap-1">
					{hospital.rating ? (
						<>
							{Array.from({ length: Math.floor(hospital.rating) }).map(
								(_, i) => (
									<FaRegStar
										key={i}
										className="text-amber-500"
										size={18}
									/>
								)
							)}
							<span className="ml-1 text-xs text-slate-600">
								{hospital.rating}
							</span>
						</>
					) : (
						<span className="text-xs text-slate-400">No rating yet</span>
					)}
				</div>

				<div className="flex flex-wrap items-center justify-end gap-2">
					{onPreview && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onPreview();
							}}
							className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
						>
							Preview
							<FiArrowUpRight />
						</button>
					)}
					<button
						type="button"
						onClick={openDirections}
						className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#2955d9,#4f83ff)] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-200/50 transition hover:translate-y-[-1px]"
					>
						<FiNavigation className="shrink-0 text-white" size={15} />
						Directions
					</button>
				</div>
			</div>
		</div>
	);
}
