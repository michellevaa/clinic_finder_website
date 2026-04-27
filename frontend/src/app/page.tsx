'use client';

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Maps from './components/Maps';

export default function Home() {
	const [overrideLocation, setOverrideLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	return (
		<div className="min-h-screen bg-[var(--background)] px-3 py-4 text-[var(--foreground)]">
			<div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[2.5rem] border border-white/70 bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] shadow-[0_30px_90px_rgba(20,33,61,0.16)]">
				<Navbar />
				<div className="flex-1 overflow-y-auto">
					<Maps
						overrideLocation={overrideLocation}
						onLocationSelect={setOverrideLocation}
					/>
				</div>
			</div>
		</div>
	);
}
