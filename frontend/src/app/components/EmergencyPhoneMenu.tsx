'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiPhone } from 'react-icons/fi';
import {
	MALAYSIA_MERS_NOTE,
	malaysiaEmergencyLines,
} from '../data/malaysiaEmergencyContacts';
import { EMERGENCY_SYNC_EVENT } from '../lib/emergencySyncEvent';

function telHref(tel: string): string {
	const digits = tel.replace(/\s/g, '');
	if (digits.startsWith('+')) return `tel:${digits}`;
	return `tel:${digits}`;
}

function digitsOnly(s: string): string {
	return s.replace(/\D/g, '');
}

type Props = {
	/** 'dark' = navbar; 'light' = contact section */
	surface?: 'dark' | 'light';
	className?: string;
	triggerClassName?: string;
};

export default function EmergencyPhoneMenu({
	surface = 'dark',
	className = '',
	triggerClassName = '',
}: Props) {
	const [open, setOpen] = useState(false);
	const [emergency, setEmergency] = useState('');
	const [countryCode, setCountryCode] = useState('');
	const rootRef = useRef<HTMLDivElement>(null);

	const sync = () => {
		if (typeof window === 'undefined') return;
		setEmergency(localStorage.getItem('emergencyNumber') ?? '');
		setCountryCode(localStorage.getItem('emergencyCountryCode') ?? '');
	};

	useEffect(() => {
		sync();
		const onSync = () => sync();
		window.addEventListener(EMERGENCY_SYNC_EVENT, onSync);
		window.addEventListener('storage', onSync);
		return () => {
			window.removeEventListener(EMERGENCY_SYNC_EVENT, onSync);
			window.removeEventListener('storage', onSync);
		};
	}, []);

	useEffect(() => {
		if (!open) return;
		const onDoc = (e: MouseEvent) => {
			if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', onDoc);
		return () => document.removeEventListener('mousedown', onDoc);
	}, [open]);

	const isMalaysia = countryCode === 'MY';

	const panel =
		surface === 'dark'
			? 'border border-white/15 bg-slate-900/98 text-slate-100 shadow-2xl backdrop-blur-md'
			: 'border border-slate-200 bg-white text-slate-800 shadow-xl';

	const item =
		surface === 'dark'
			? 'hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none text-teal-100'
			: 'hover:bg-teal-50 focus-visible:bg-teal-50 focus-visible:outline-none text-slate-800';

	const iconClass =
		surface === 'dark' ? 'text-teal-400' : 'text-teal-600';

	return (
		<div
			ref={rootRef}
			className={`relative inline-flex flex-col items-stretch ${surface === 'dark' ? 'min-w-[9.75rem]' : ''} ${className}`}
		>
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				aria-expanded={open}
				aria-haspopup="true"
				className={
					surface === 'dark'
						? `flex w-full min-w-[9.75rem] items-center justify-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-2 text-xs font-semibold text-teal-200 transition-colors hover:border-teal-400/60 hover:bg-teal-500/20 md:min-w-[10.5rem] ${triggerClassName}`
						: `inline-flex w-full min-w-[9.75rem] items-center justify-center gap-2 rounded-xl border border-teal-600/30 bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-teal-900/15 transition hover:from-teal-500 hover:to-teal-600 sm:min-w-[10.5rem] sm:w-auto ${triggerClassName}`
				}
			>
				<FiPhone className={surface === 'dark' ? 'text-sm' : 'text-base'} />
				<span>Emergency</span>
				<FiChevronDown
					className={`transition-transform ${open ? 'rotate-180' : ''} opacity-80`}
					size={15}
				/>
			</button>

			{open && (
				<div
					className={`absolute right-0 z-[200] mt-2 w-[min(22rem,calc(100vw-1rem))] rounded-[1.25rem] p-3 sm:min-w-[16rem] sm:p-4 ${panel}`}
					role="menu"
				>
					{isMalaysia ? (
						<div className="space-y-2.5">
							<p
								className={`border-b pb-2.5 text-xs leading-6 ${
									surface === 'dark'
										? 'border-white/10 text-slate-300'
										: 'border-slate-200 text-slate-600'
								}`}
							>
								{MALAYSIA_MERS_NOTE}
							</p>
							<p
								className={`text-[11px] leading-5 ${
									surface === 'dark' ? 'text-slate-400' : 'text-slate-500'
								}`}
							>
								Private hospital lines (examples; verify with the hospital).
							</p>
							<ul className="max-h-[min(52vh,280px)] space-y-0.5 overflow-y-auto pr-0.5">
								{malaysiaEmergencyLines.map((line) => (
									<li key={line.tel + line.label}>
										<a
											href={telHref(line.tel)}
											role="menuitem"
											className={`flex items-start gap-2.5 rounded-xl px-2 py-2 text-xs transition ${item}`}
											onClick={() => setOpen(false)}
										>
											<FiPhone className={`mt-0.5 shrink-0 text-sm ${iconClass}`} />
											<span className="text-left leading-snug">{line.label}</span>
										</a>
									</li>
								))}
							</ul>
						</div>
					) : (
						<div className="space-y-2">
							{digitsOnly(emergency).length >= 2 ? (
								<>
									<p
										className={
											surface === 'dark'
												? 'text-[11px] text-slate-400'
												: 'text-[11px] text-slate-500'
										}
									>
										Primary emergency number for your detected region:
									</p>
									<p
										className={`text-sm font-semibold ${
											surface === 'dark' ? 'text-white' : 'text-slate-900'
										}`}
									>
										{emergency}
									</p>
									<a
										href={`tel:${digitsOnly(emergency)}`}
										role="menuitem"
										className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-teal-500"
										onClick={() => setOpen(false)}
									>
										<FiPhone /> Call now
									</a>
								</>
							) : emergency && /not available/i.test(emergency) ? (
								<p
									className={
										surface === 'dark'
											? 'text-sm text-slate-400'
											: 'text-sm text-slate-500'
									}
								>
									{emergency}
								</p>
							) : (
								<p
									className={
										surface === 'dark'
											? 'text-sm text-slate-400'
											: 'text-sm text-slate-500'
									}
								>
									Allow location or search a place on the map to load your local
									emergency number.
								</p>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
