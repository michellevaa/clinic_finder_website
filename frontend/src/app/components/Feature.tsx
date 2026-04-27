import React from 'react';
import {
	FiBell,
	FiClock,
	FiLayers,
	FiNavigation,
	FiPhoneCall,
	FiTrendingUp,
} from 'react-icons/fi';
import Container from './common/Container';

const featureCards = [
	{
		icon: <FiLayers className="text-2xl" />,
		title: 'Nearby search',
		description:
			'Find hospitals and clinics using your current location or a searched area.',
		style: 'border-blue-100 bg-[linear-gradient(180deg,#eef4ff_0%,#ffffff_100%)] text-blue-700',
	},
	{
		icon: <FiNavigation className="text-2xl" />,
		title: 'Directions',
		description:
			'Open routes quickly from each result card and head to the selected location.',
		style: 'border-emerald-100 bg-[linear-gradient(180deg,#ecfff7_0%,#ffffff_100%)] text-emerald-700',
	},
	{
		icon: <FiPhoneCall className="text-2xl" />,
		title: 'Emergency help',
		description:
			'Keep emergency contact shortcuts available when urgent support is needed.',
		style: 'border-rose-100 bg-[linear-gradient(180deg,#fff1f2_0%,#ffffff_100%)] text-rose-700',
	},
];

const productHighlights = [
	{
		label: 'Distance sorting',
		text: 'Results appear with the nearest places first for faster decisions.',
		icon: <FiTrendingUp className="text-xl" />,
	},
	{
		label: 'Open now filter',
		text: 'Switch to currently open clinics when timing matters most.',
		icon: <FiClock className="text-xl" />,
	},
	{
		label: 'Quick actions',
		text: 'Directions, preview, and emergency access stay close to the results.',
		icon: <FiBell className="text-xl" />,
	},
];

const Feature = () => {
	return (
		<section id="features" className="pb-14 pt-4 md:pb-20">
			<Container>
				<div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
					<div className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-[0_28px_70px_rgba(15,23,42,0.18)] md:p-8">
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
							App features
						</p>
						<h2 className="mt-3 text-white">
							What you can do
						</h2>
						<p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
							Use the app to search, compare nearby options, and move quickly
							from map browsing to directions or emergency support.
						</p>

						<div className="mt-8 space-y-4">
							{productHighlights.map((item) => (
								<div
									key={item.label}
									className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
								>
									<div className="rounded-2xl bg-white/10 p-3 text-cyan-300">
										{item.icon}
									</div>
									<div>
										<p className="font-semibold text-white">{item.label}</p>
										<p className="mt-1 text-sm leading-6 text-slate-400">
											{item.text}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-3">
						{featureCards.map((card) => (
							<div
								key={card.title}
								className={`rounded-[1.75rem] border p-6 shadow-sm ${card.style}`}
							>
								<div className="inline-flex rounded-2xl bg-white p-3 shadow-sm">
									{card.icon}
								</div>
								<h3 className="mt-5 text-xl font-bold text-slate-950">
									{card.title}
								</h3>
								<p className="mt-3 text-sm leading-7 text-slate-600">
									{card.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</Container>
		</section>
	);
};

export default Feature;
