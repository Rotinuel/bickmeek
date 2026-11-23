// Builds standard WhatsApp click-to-chat links: https://wa.me/<number>?text=<message>

export function waLink(number, message = '') {
	const digits = String(number ?? '').replace(/\D/g, '');
	const text = message ? `?text=${encodeURIComponent(message)}` : '';
	return `https://wa.me/${digits}${text}`;
}

export function primaryWhatsApp(settings) {
	return settings?.whatsapp?.[0]?.number ?? '2347016890048';
}

export const waMessage = {
	general: (biz = 'BiceMeek Cleaning Services') => `Hello ${biz}, I would like to enquire about your cleaning services.`,
	service: (name, biz = 'BiceMeek Cleaning Services') => `Hello ${biz}, I would like to enquire about your ${name} service.`,
	plan: (planName, biz = 'BiceMeek Cleaning Services') =>
		`Hello ${biz}, I would like to enquire about your ${planName.toLowerCase()} service.`,
	quote: (biz = 'BiceMeek Cleaning Services') => `Hello ${biz}, I would like a quotation for commercial cleaning.`,
	booking: (ref, summary = {}, biz = 'BiceMeek Cleaning Services') => {
		const parts = [`Hello ${biz}, I just sent a booking request on your website.`, `Reference: ${ref}`];
		if (summary.service) parts.push(`Service: ${summary.service}`);
		if (summary.frequencyLabel) parts.push(`Frequency: ${summary.frequencyLabel}`);
		if (summary.preferredDate) parts.push(`Preferred date: ${summary.preferredDate}`);
		if (summary.preferredTime) parts.push(`Preferred time: ${summary.preferredTime}`);
		return parts.join('\n');
	}
};

/** Pretty print 2347016890048 → +234 701 689 0048 */
export function formatPhone(value) {
	const d = String(value ?? '').replace(/\D/g, '');
	if (d.startsWith('234') && d.length === 13) return `+234 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
	return value;
}

export function telLink(value) {
	return `tel:+${String(value ?? '').replace(/\D/g, '')}`;
}
