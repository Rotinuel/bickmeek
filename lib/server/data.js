import { env as publicEnv } from '$env/dynamic/public';
import { plain } from './db.js';
import { GalleryItem, Plan, SeoPage, Service, Settings, Testimonial } from './models.js';
import { DEFAULT_SEO, DEFAULT_SETTINGS } from './seed-data.js';

/* Short in-memory cache for content read on every page. Admin writes clear it. */
const cache = (globalThis.__bicemeekCache ??= new Map());
const TTL = 30_000;

async function cached(key, fn) {
	const hit = cache.get(key);
	if (hit && hit.expires > Date.now()) return hit.value;
	const value = await fn();
	cache.set(key, { value, expires: Date.now() + TTL });
	return value;
}

export function invalidateContent() {
	cache.clear();
}

export function siteUrl(url) {
	const configured = (publicEnv.PUBLIC_SITE_URL || '').replace(/\/+$/, '');
	return configured || url.origin;
}

export async function getSettings() {
	return cached('settings', async () => {
		const doc = await Settings.findOne({ key: 'site' }).lean();
		const s = { ...DEFAULT_SETTINGS, ...plain(doc) };
		s.whatsapp = (s.whatsapp || []).filter((w) => w?.number);
		s.phones = (s.phones || []).filter(Boolean);
		s.openingHours = (s.openingHours || []).filter((o) => o?.days || o?.hours);
		s.social = s.social || {};
		s.fullAddress = [s.streetAddress, s.city, s.state, s.country].filter(Boolean).join(', ');
		// Environment variables win; admin values are the fallback.
		s.gaMeasurementId = publicEnv.PUBLIC_GA_MEASUREMENT_ID || s.gaMeasurementId || '';
		s.googleSiteVerification = publicEnv.PUBLIC_GOOGLE_SITE_VERIFICATION || s.googleSiteVerification || '';
		delete s.heroImageKey;
		delete s.aboutImageKey;
		delete s.defaultOgImageKey;
		return s;
	});
}

export async function getServices({ includeDisabled = false } = {}) {
	return cached(`services:${includeDisabled}`, async () => {
		const q = includeDisabled ? {} : { enabled: true };
		return plain(await Service.find(q).sort({ order: 1, name: 1 }).lean());
	});
}

export async function getService(slug) {
	const services = await getServices();
	return services.find((s) => s.slug === slug) ?? null;
}

export async function getPlans() {
	return cached('plans', async () => plain(await Plan.find({ enabled: true }).sort({ order: 1 }).lean()));
}

export async function getSeo(page) {
	return cached(`seo:${page}`, async () => {
		const doc = await SeoPage.findOne({ page }).lean();
		return { ...(DEFAULT_SEO[page] || {}), ...stripEmpty(plain(doc)) };
	});
}

export async function getTestimonials(limit = 0) {
	return cached(`testimonials:${limit}`, async () => {
		const q = Testimonial.find({ published: true }).sort({ order: 1, createdAt: -1 });
		if (limit) q.limit(limit);
		return plain(await q.lean());
	});
}

export async function getGallery({ limit = 0, featuredFirst = false } = {}) {
	return cached(`gallery:${limit}:${featuredFirst}`, async () => {
		const sort = featuredFirst ? { featured: -1, order: 1, createdAt: -1 } : { order: 1, createdAt: -1 };
		const q = GalleryItem.find({ published: true }).sort(sort).select('-storageKeys');
		if (limit) q.limit(limit);
		return plain(await q.lean());
	});
}

function stripEmpty(obj) {
	if (!obj) return {};
	return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v !== null && v !== undefined));
}
