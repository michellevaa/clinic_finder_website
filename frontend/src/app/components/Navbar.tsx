'use client';
import React from 'react';
import Image from 'next/image';
import EmergencyPhoneMenu from './EmergencyPhoneMenu';

const Navbar = () => {
	return (
		<nav className="sticky top-0 z-[100] border-b border-white/70 bg-white/88 px-4 py-3 shadow-sm backdrop-blur-xl">
			<div className="flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-3">
					<div className="relative">
						<div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-blue-300 to-cyan-300 opacity-80 blur-[2px]" />
						<Image
							src="/Logo.jpg"
							alt="Clinic Finder logo"
							width={34}
							height={34}
							className="relative rounded-full ring-2 ring-white/70"
						/>
					</div>
					<div className="min-w-0">
						<p className="truncate text-sm font-bold tracking-tight text-slate-900">
							Clinic Finder
						</p>
						<p className="text-[11px] font-medium uppercase tracking-[0.18em] text-blue-700">
							Mobile results
						</p>
					</div>
				</div>

				<EmergencyPhoneMenu surface="light" />
			</div>
		</nav>
	);
};

export default Navbar;
