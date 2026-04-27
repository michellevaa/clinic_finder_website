import React from 'react';

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer className="w-full border-t border-white/60 bg-white/70 py-8 text-center text-sm text-slate-500 backdrop-blur">
			<p>© {year} Clinic Finder. Redesigned for a clearer care-search experience.</p>
		</footer>
	);
};

export default Footer;
