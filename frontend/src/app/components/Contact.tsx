'use client';

import React from 'react';
import { FiAlertCircle, FiPhoneCall, FiShield } from 'react-icons/fi';
import Container from './common/Container';
import EmergencyPhoneMenu from './EmergencyPhoneMenu';

const Contact = () => {
	return (
		<section id="contact" className="pb-16 pt-2 md:pb-20">
			<Container>
				<div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
					<div className="rounded-[2rem] border border-rose-100 bg-[linear-gradient(180deg,#fff2f2_0%,#ffffff_100%)] p-7 shadow-sm md:p-8">
						<div className="inline-flex rounded-2xl bg-white p-3 text-rose-600 shadow-sm">
							<FiAlertCircle className="text-2xl" />
						</div>
						<p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">
							Emergency access
						</p>
						<h2 className="mt-3 text-slate-950">
							Critical help should stay one tap away
						</h2>
						<p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
							For severe breathing trouble, chest pain, unconsciousness, or other
							life-threatening symptoms, call emergency services immediately.
							This section is now more prominent so urgent actions are not lost
							below general website content.
						</p>
					</div>

					<div className="grid gap-4 rounded-[2rem] bg-slate-950 p-7 text-white shadow-[0_28px_70px_rgba(15,23,42,0.18)] md:p-8">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
								<div className="flex items-center gap-3">
									<div className="rounded-2xl bg-white/10 p-3 text-cyan-300">
										<FiPhoneCall className="text-xl" />
									</div>
									<div>
										<p className="text-sm font-semibold text-white">
											Malaysia emergency
										</p>
										<p className="text-sm text-slate-400">Call 999 for MERS</p>
									</div>
								</div>
							</div>

							<div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
								<div className="flex items-center gap-3">
									<div className="rounded-2xl bg-white/10 p-3 text-cyan-300">
										<FiShield className="text-xl" />
									</div>
									<div>
										<p className="text-sm font-semibold text-white">
											Location-aware support
										</p>
										<p className="text-sm text-slate-400">
											Menu updates by detected country
										</p>
									</div>
								</div>
							</div>
						</div>

						<p className="text-sm leading-7 text-slate-300">
							Open the menu below for emergency dial shortcuts. Private hospital
							A&amp;E contacts are shown when available, and the nearest care
							options above stay connected to the same location search.
						</p>

						<div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
									Quick action menu
								</p>
								<p className="mt-2 text-lg font-semibold text-white">
									Open emergency contacts
								</p>
							</div>
							<EmergencyPhoneMenu surface="light" />
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
};

export default Contact;
