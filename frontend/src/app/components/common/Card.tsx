import React from 'react';

interface CardProps {
	icon?: React.ReactNode;
	iconBg?: string;
	title?: string;
	description?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
}

const Card: React.FC<CardProps> = ({
	icon,
	iconBg = 'bg-teal-100',
	title,
	description,
	children,
	className = '',
}) => {
	return (
		<div
			className={`group flex max-w-sm flex-col justify-center rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-200/80 hover:shadow-lg hover:shadow-teal-500/10 ${className}`}
		>
			{icon && (
				<div
					className={`${iconBg} mb-6 flex justify-center rounded-2xl p-4 transition-transform duration-300 group-hover:scale-105`}
				>
					{icon}
				</div>
			)}
			{title && (
				<h5 className="mb-3 text-xl font-bold text-slate-900">{title}</h5>
			)}
			{description && (
				<div className="w-full text-base text-slate-600">{description}</div>
			)}
			{children}
		</div>
	);
};

export default Card;
