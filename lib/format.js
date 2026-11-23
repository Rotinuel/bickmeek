export function formatNaira(value) {
	if (value === null || value === undefined || value === '') return '';
	return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
}

export function formatDate(value, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
	if (!value) return '';
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos', ...opts });
}

export function formatDateTime(value) {
	if (!value) return '';
	const d = new Date(value);
	return d.toLocaleString('en-NG', {
		timeZone: 'Africa/Lagos',
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	});
}

/** yyyy-mm-dd for <input type="date"> */
export function toInputDate(value) {
	if (!value) return '';
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

export function todayInLagos() {
	return new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' });
}

/** Turns YouTube / Vimeo page links into embeddable URLs; returns null for direct video files. */
export function videoEmbed(url) {
	if (!url) return null;
	try {
		const u = new URL(url, 'https://x.invalid');
		if (/(^|\.)youtube\.com$/.test(u.hostname)) {
			const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop();
			return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
		}
		if (u.hostname === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
		if (/(^|\.)vimeo\.com$/.test(u.hostname)) {
			const id = u.pathname.split('/').filter(Boolean).pop();
			return id ? `https://player.vimeo.com/video/${id}` : null;
		}
	} catch {
		return null;
	}
	return null;
}
