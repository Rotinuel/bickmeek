import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import { BOOKING_STATUSES, GALLERY_CATEGORIES, SEO_PAGES } from '../constants.js';

export { BOOKING_STATUSES, GALLERY_CATEGORIES, SEO_PAGES };

const { Schema, model, models } = mongoose;

const make = (name, schema) => models[name] || model(name, schema);

/* ── Admin & sessions ─────────────────────────────────────── */

const AdminSchema = new Schema(
	{
		name: { type: String, trim: true, maxlength: 80 },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160 },
		passwordHash: { type: String, required: true },
		lastLoginAt: Date
	},
	{ timestamps: true }
);
export const Admin = make('Admin', AdminSchema);

const SessionSchema = new Schema(
	{
		tokenHash: { type: String, required: true, unique: true },
		admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
		userAgent: { type: String, maxlength: 300 },
		expiresAt: { type: Date, required: true }
	},
	{ timestamps: true }
);
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const Session = make('Session', SessionSchema);

/* ── Bookings ─────────────────────────────────────────────── */

const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const makeRef = () =>
	'BM-' + Array.from(randomBytes(6), (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join('');

const BookingSchema = new Schema(
	{
		ref: { type: String, required: true, unique: true, default: makeRef },
		requestType: { type: String, enum: ['booking', 'quote'], default: 'booking' },
		serviceSlug: { type: String, maxlength: 80 },
		serviceName: { type: String, maxlength: 120 },
		frequency: { type: String, enum: ['one_time', 'daily', 'weekly', 'monthly'], default: 'one_time' },
		preferredDate: Date,
		preferredTime: { type: String, maxlength: 60 },
		fullName: { type: String, required: true, maxlength: 120 },
		phone: { type: String, required: true, maxlength: 24 },
		email: { type: String, maxlength: 160 },
		contactPreference: { type: String, enum: ['whatsapp', 'call', 'email'], default: 'whatsapp' },
		address: { type: String, required: true, maxlength: 300 },
		area: { type: String, maxlength: 120 },
		propertyType: { type: String, maxlength: 60 },
		rooms: { type: String, maxlength: 60 },
		additionalRequests: { type: String, maxlength: 2000 },
		source: { type: String, maxlength: 60 },
		status: { type: String, enum: BOOKING_STATUSES.map((s) => s.value), default: 'new', index: true },
		scheduledDate: Date,
		scheduledTime: { type: String, maxlength: 60 },
		adminNotes: { type: String, maxlength: 4000 },
		statusHistory: [
			{
				status: String,
				at: { type: Date, default: Date.now },
				by: String
			}
		]
	},
	{ timestamps: true }
);
BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ frequency: 1 });
export const Booking = make('Booking', BookingSchema);

/* ── Services & plans ─────────────────────────────────────── */

const ServiceSchema = new Schema(
	{
		slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 80 },
		name: { type: String, required: true, trim: true, maxlength: 100 },
		shortDescription: { type: String, maxlength: 240 },
		description: { type: String, maxlength: 4000 },
		covers: [{ type: String, maxlength: 200 }],
		idealFor: [{ type: String, maxlength: 200 }],
		benefits: [{ type: String, maxlength: 240 }],
		icon: { type: String, default: 'sparkles', maxlength: 40 },
		image: { type: String, maxlength: 600 },
		imageKey: { type: String, maxlength: 300 },
		imageAlt: { type: String, maxlength: 200 },
		priceInfo: { type: String, maxlength: 160 },
		order: { type: Number, default: 0 },
		enabled: { type: Boolean, default: true },
		seoTitle: { type: String, maxlength: 80 },
		seoDescription: { type: String, maxlength: 200 },
		seoKeywords: { type: String, maxlength: 300 }
	},
	{ timestamps: true }
);
export const Service = make('Service', ServiceSchema);

const PlanSchema = new Schema(
	{
		key: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true, unique: true },
		name: { type: String, required: true, maxlength: 80 },
		tagline: { type: String, maxlength: 160 },
		description: { type: String, maxlength: 1200 },
		bestFor: { type: String, maxlength: 240 },
		price: { type: Number, min: 0, default: null },
		priceUnit: { type: String, maxlength: 40 },
		priceNote: { type: String, maxlength: 160 },
		inclusions: [{ type: String, maxlength: 200 }],
		highlighted: { type: Boolean, default: false },
		enabled: { type: Boolean, default: true },
		order: { type: Number, default: 0 }
	},
	{ timestamps: true }
);
export const Plan = make('Plan', PlanSchema);

/* ── Gallery & testimonials ───────────────────────────────── */

const GalleryItemSchema = new Schema(
	{
		title: { type: String, trim: true, maxlength: 140 },
		caption: { type: String, maxlength: 600 },
		category: { type: String, enum: GALLERY_CATEGORIES.map((c) => c.value), default: 'residential' },
		mediaType: { type: String, enum: ['image', 'video', 'before_after'], required: true },
		url: { type: String, maxlength: 600 },
		beforeUrl: { type: String, maxlength: 600 },
		afterUrl: { type: String, maxlength: 600 },
		alt: { type: String, maxlength: 200 },
		storageKeys: [{ type: String, maxlength: 300 }],
		featured: { type: Boolean, default: false },
		published: { type: Boolean, default: true },
		order: { type: Number, default: 0 }
	},
	{ timestamps: true }
);
export const GalleryItem = make('GalleryItem', GalleryItemSchema);

const TestimonialSchema = new Schema(
	{
		name: { type: String, required: true, trim: true, maxlength: 100 },
		location: { type: String, trim: true, maxlength: 100 },
		service: { type: String, trim: true, maxlength: 100 },
		rating: { type: Number, min: 1, max: 5, default: 5 },
		text: { type: String, required: true, maxlength: 1200 },
		isDemo: { type: Boolean, default: false },
		published: { type: Boolean, default: false },
		order: { type: Number, default: 0 }
	},
	{ timestamps: true }
);
export const Testimonial = make('Testimonial', TestimonialSchema);

/* ── Settings & SEO ───────────────────────────────────────── */

const SettingsSchema = new Schema(
	{
		key: { type: String, default: 'site', unique: true },
		businessName: String,
		tagline: String,
		slogan: String,
		phones: [String],
		whatsapp: [{ label: String, number: String }],
		email: String,
		streetAddress: String,
		city: String,
		state: String,
		country: String,
		mapUrl: String,
		googleBusinessUrl: String,
		openingHours: [{ days: String, hours: String }],
		social: {
			facebook: String,
			instagram: String,
			tiktok: String,
			x: String,
			linkedin: String,
			youtube: String
		},
		heroImage: String,
		heroImageKey: String,
		heroImageAlt: String,
		aboutImage: String,
		aboutImageKey: String,
		defaultOgImage: String,
		defaultOgImageKey: String,
		gaMeasurementId: String,
		googleSiteVerification: String
	},
	{ timestamps: true }
);
export const Settings = make('Settings', SettingsSchema);

const SeoPageSchema = new Schema(
	{
		page: { type: String, required: true, unique: true },
		title: { type: String, maxlength: 80 },
		description: { type: String, maxlength: 200 },
		keywords: { type: String, maxlength: 300 },
		ogImage: { type: String, maxlength: 600 },
		ogImageKey: { type: String, maxlength: 300 }
	},
	{ timestamps: true }
);
export const SeoPage = make('SeoPage', SeoPageSchema);

/* ── Rate limiting (works across serverless instances) ────── */

const RateLimitSchema = new Schema({
	key: { type: String, required: true, unique: true },
	count: { type: Number, default: 0 },
	expiresAt: { type: Date, required: true }
});
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RateLimit = make('RateLimit', RateLimitSchema);
