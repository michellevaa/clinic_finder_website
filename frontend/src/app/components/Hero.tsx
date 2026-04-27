import React from 'react';
import { FiHeart, FiStar } from 'react-icons/fi';
import Container from './common/Container';

const Hero: React.FC = () => {
	return (
		<section className="relative overflow-hidden pb-3 pt-5 md:pb-3 md:pt-8">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(circle_at_top_left,_rgba(41,85,217,0.18),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(93,211,255,0.22),_transparent_34%)]" />
			<Container>
				<div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
					<div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_30px_80px_rgba(20,33,61,0.12)] backdrop-blur md:p-8">
						<div className="mb-5 flex flex-wrap items-center gap-3">
							<span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
								<FiHeart className="text-sm" />
								Find care fast
							</span>
							<span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
								Mobile-style hospital finder
							</span>
						</div>

						<div className="max-w-2xl">
							<h1 className="text-balance text-slate-950">
								Search nearby hospitals or clinics by name, location, or care
								type.
							</h1>
							<p className="mt-4 max-w-xl text-base text-slate-600 md:text-lg">
								Check the search, filters, map, and recommended places together in
								the section below for a cleaner app-like flow.
							</p>
						</div>
					</div>

					<div className="rounded-[2rem] bg-[linear-gradient(160deg,#d6e7ff_0%,#c5f1ff_58%,#ffffff_100%)] p-6 shadow-[0_24px_60px_rgba(41,85,217,0.18)]">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
									Quick access
								</p>
								<h3 className="mt-2 text-2xl font-bold text-slate-950">
									Everything important on one screen
								</h3>
							</div>
							<div className="rounded-2xl bg-white/80 p-3 text-blue-700 shadow-sm">
								<FiStar className="text-2xl" />
							</div>
						</div>

						<div className="mt-6 space-y-3">
							{[
								'Search by hospital name, clinic, suburb, or specialty',
								'See the map and nearest results close together',
								'Open directions or emergency contacts right away',
							].map((step, index) => (
								<div
									key={step}
									className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm"
								>
									<div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
										{index + 1}
									</div>
									<p className="text-sm font-medium text-slate-700">{step}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
};

export default Hero;
