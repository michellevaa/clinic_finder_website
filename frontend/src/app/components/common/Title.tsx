import React from 'react';

type Props = {
	title: string;
	description: string;
	/** Small label shown top-left, e.g. "Map View" */
	eyebrow?: string;
};

const Title = ({ title, description, eyebrow }: Props) => {
	return (
		<div className="relative mb-2 w-full">
			{eyebrow && (
				<p className="mb-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
					{eyebrow}
				</p>
			)}
			<div className="flex flex-col items-center justify-center gap-3 text-center">
				<div className="h-1 w-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
				<h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
					{title}
				</h2>
				<p className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
					{description}
				</p>
			</div>
		</div>
	);
};

export default Title;
