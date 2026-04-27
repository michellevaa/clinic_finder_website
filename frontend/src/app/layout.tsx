import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
	variable: '--font-plus-jakarta',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'Clinic Finder',
	description: 'Find nearby clinics quickly with maps and distance-sorted results.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${plusJakarta.variable} font-sans antialiased`}>{children}</body>
		</html>
	);
}
