// Shared, browser-safe constants. Server models import these too.

export const BOOKING_STATUSES = [
	{ value: 'new', label: 'New' },
	{ value: 'contacted', label: 'Contacted' },
	{ value: 'quotation_sent', label: 'Quotation sent' },
	{ value: 'confirmed', label: 'Confirmed' },
	{ value: 'in_progress', label: 'In progress' },
	{ value: 'completed', label: 'Completed' },
	{ value: 'cancelled', label: 'Cancelled' }
];

export const statusLabel = (v) => BOOKING_STATUSES.find((s) => s.value === v)?.label ?? v;

export const FREQUENCIES = [
	{ value: 'one_time', label: 'One-time cleaning' },
	{ value: 'daily', label: 'Daily' },
	{ value: 'weekly', label: 'Weekly' },
	{ value: 'monthly', label: 'Monthly' }
];

export const frequencyLabel = (v) => FREQUENCIES.find((f) => f.value === v)?.label ?? v;

export const PROPERTY_TYPES = [
	'Apartment / flat',
	'Self-contained room',
	'Bungalow',
	'Duplex / terrace',
	'Office',
	'Shop or retail space',
	'Event hall or venue',
	'Place of worship',
	'School or clinic',
	'Construction or renovation site',
	'Other'
];

export const TIME_WINDOWS = [
	'Morning (8am – 11am)',
	'Midday (11am – 2pm)',
	'Afternoon (2pm – 5pm)',
	'I’m flexible'
];

export const GALLERY_CATEGORIES = [
	{ value: 'residential', label: 'Residential' },
	{ value: 'office', label: 'Office & commercial' },
	{ value: 'post-construction', label: 'Post-construction' },
	{ value: 'deep-cleaning', label: 'Deep cleaning' },
	{ value: 'move-in-out', label: 'Move-in / move-out' },
	{ value: 'laundry', label: 'Laundry' }
];

export const categoryLabel = (v) => GALLERY_CATEGORIES.find((c) => c.value === v)?.label ?? v;

export const SEO_PAGES = [
	{ key: 'home', label: 'Homepage', path: '/' },
	{ key: 'about', label: 'About us', path: '/about' },
	{ key: 'services', label: 'Services overview', path: '/services' },
	{ key: 'cleaning-plans', label: 'Cleaning plans', path: '/cleaning-plans' },
	{ key: 'cleaning-subscription', label: 'Subscription landing page', path: '/cleaning-subscription' },
	{ key: 'book', label: 'Book a cleaning', path: '/book' },
	{ key: 'gallery', label: 'Gallery', path: '/gallery' },
	{ key: 'testimonials', label: 'Testimonials', path: '/testimonials' },
	{ key: 'contact', label: 'Contact', path: '/contact' }
];

export const SERVICE_ICONS = [
	'home',
	'building',
	'hard-hat',
	'sparkles',
	'truck',
	'shirt',
	'spray-can',
	'brush',
	'calendar',
	'sofa',
	'bath',
	'washing-machine'
];

export const UPLOAD_LIMITS = {
	imageBytes: 4 * 1024 * 1024,
	videoBytes: 50 * 1024 * 1024,
	imageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
	videoTypes: ['video/mp4', 'video/webm']
};
