/**
 * Small, dependency-free validation and sanitising helpers.
 * Svelte escapes output by default; these keep stored data tidy and bounded.
 */

// Remove control characters (keeps \n and \t) and HTML angle brackets.
export function clean(value, max = 500) {
	if (value === null || value === undefined) return '';
	return String(value)
		.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
		.replace(/[<>]/g, '')
		.trim()
		.slice(0, max);
}

export function cleanMultiline(value, max = 2000) {
	return clean(value, max).replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
}

/** "one per line" textarea → array of trimmed strings */
export function lines(value, maxItems = 20, maxLen = 200) {
	return cleanMultiline(value, maxItems * (maxLen + 1))
		.split('\n')
		.map((l) => l.trim())
		.filter(Boolean)
		.slice(0, maxItems)
		.map((l) => l.slice(0, maxLen));
}

export function bool(value) {
	return value === 'on' || value === 'true' || value === '1' || value === true;
}

export function int(value, { min = -Infinity, max = Infinity, fallback = 0 } = {}) {
	const n = Number.parseInt(String(value ?? ''), 10);
	if (Number.isNaN(n)) return fallback;
	return Math.min(max, Math.max(min, n));
}

export function money(value) {
	const raw = String(value ?? '').replace(/[,\s₦]/g, '');
	if (!raw) return null;
	const n = Number(raw);
	return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

export function isEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 160;
}

/** Nigerian-friendly phone check: 10–15 digits, optional leading +. */
export function normalisePhone(value) {
	const v = clean(value, 30).replace(/[\s()-]/g, '');
	if (!/^\+?\d{10,15}$/.test(v)) return null;
	return v;
}

/** Digits-only international form for WhatsApp links (e.g. 2347016890048). */
export function toWhatsAppNumber(value) {
	let digits = String(value ?? '').replace(/\D/g, '');
	if (digits.startsWith('0') && digits.length === 11) digits = '234' + digits.slice(1);
	return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

export function slugify(value) {
	return clean(value, 120)
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

export function isSafeUrl(value) {
	if (!value) return true;
	if (value.startsWith('/') && !value.startsWith('//')) return true;
	try {
		const u = new URL(value);
		return u.protocol === 'https:' || u.protocol === 'http:';
	} catch {
		return false;
	}
}

export function dateOnly(value) {
	if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return null;
	const d = new Date(`${value}T12:00:00Z`);
	return Number.isNaN(d.getTime()) ? null : d;
}

export function escapeRegex(value) {
	return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
