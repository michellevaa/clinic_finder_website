/** Shortened Malaysia emergency & private hospital lines (user-education; not exhaustive). */

export const MALAYSIA_MERS_NOTE =
	'999 connects to MERS (ambulance, fire, police). Free national hotline — on many networks it works even without a SIM.';

export type MalaysiaPhoneLine = {
	label: string;
	/** E.164 or local digits for tel: */
	tel: string;
};

/** Primary + optional private A&E / ambulance examples. */
export const malaysiaEmergencyLines: MalaysiaPhoneLine[] = [
	{ label: '999 — MERS (ambulance, fire, police)', tel: '999' },
	{ label: 'Sunway Medical — A&E', tel: '+60355668888' },
	{ label: 'Sunway Medical — Ambulance', tel: '+60196666940' },
	{ label: 'Gleneagles KL — Ambulance', tel: '+60341413131' },
	{ label: 'Regency Specialist — Hotline', tel: '1800222505' },
	{ label: 'Thomson Kota Damansara', tel: '+60362871111' },
];
