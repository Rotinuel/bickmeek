import { fail } from '@sveltejs/kit';
import { FREQUENCIES, PROPERTY_TYPES, TIME_WINDOWS } from '../constants.js';
import { getServices } from './data.js';
import { Booking } from './models.js';
import { rateLimit } from './rate-limit.js';
import { clean, cleanMultiline, dateOnly, isEmail, normalisePhone } from './validate.js';

/**
 * Form action shared by /book, /cleaning-plans and /cleaning-subscription.
 * Creates a booking *request* — staff confirm it afterwards.
 */
export async function bookingAction({ request, getClientAddress, url }) {
	const fd = await request.formData();

	// Honeypot: real people never see or fill this field.
	if (clean(fd.get('company_website'))) {
		return { success: true, ref: 'BM-RECEIVED', summary: {} };
	}

	const limit = await rateLimit('booking', getClientAddress(), { limit: 6, windowSeconds: 600 });
	if (!limit.ok) {
		return fail(429, {
			message: `Too many requests from your connection. Please wait ${Math.ceil(limit.retryAfter / 60)} minute(s), or message us on WhatsApp.`
		});
	}

	const services = await getServices();
	const values = {
		requestType: clean(fd.get('requestType'), 10) === 'quote' ? 'quote' : 'booking',
		serviceSlug: clean(fd.get('service'), 80),
		frequency: clean(fd.get('frequency'), 20) || 'one_time',
		preferredDate: clean(fd.get('preferredDate'), 10),
		preferredTime: clean(fd.get('preferredTime'), 60),
		fullName: clean(fd.get('fullName'), 120),
		phone: clean(fd.get('phone'), 30),
		email: clean(fd.get('email'), 160).toLowerCase(),
		contactPreference: clean(fd.get('contactPreference'), 10) || 'whatsapp',
		address: clean(fd.get('address'), 300),
		area: clean(fd.get('area'), 120),
		propertyType: clean(fd.get('propertyType'), 60),
		rooms: clean(fd.get('rooms'), 60),
		additionalRequests: cleanMultiline(fd.get('additionalRequests'), 2000),
		source: clean(fd.get('source'), 60) || url.pathname
	};

	const errors = {};
	const service = services.find((s) => s.slug === values.serviceSlug);
	if (!service) errors.service = 'Choose the service you need.';
	if (!FREQUENCIES.some((f) => f.value === values.frequency)) errors.frequency = 'Choose how often you need cleaning.';
	if (values.fullName.length < 2) errors.fullName = 'Enter your full name.';
	const phone = normalisePhone(values.phone);
	if (!phone) errors.phone = 'Enter a valid phone number, e.g. 0803 123 4567.';
	if (values.email && !isEmail(values.email)) errors.email = 'Check the email address, or leave it blank.';
	if (values.address.length < 5) errors.address = 'Enter the address where we will clean.';
	if (values.propertyType && !PROPERTY_TYPES.includes(values.propertyType)) errors.propertyType = 'Choose a property type.';
	if (values.preferredTime && !TIME_WINDOWS.includes(values.preferredTime)) errors.preferredTime = 'Choose a time window.';
	if (!['whatsapp', 'call', 'email'].includes(values.contactPreference)) values.contactPreference = 'whatsapp';
	if (values.contactPreference === 'email' && !values.email) errors.email = 'Add an email address so we can reply by email.';

	let preferredDate = null;
	if (values.preferredDate) {
		preferredDate = dateOnly(values.preferredDate);
		const today = new Date();
		today.setUTCHours(0, 0, 0, 0);
		if (!preferredDate) errors.preferredDate = 'Choose a valid date.';
		else if (preferredDate < today) errors.preferredDate = 'Choose today or a future date.';
	}

	if (Object.keys(errors).length) {
		return fail(400, { errors, values, message: 'Please check the highlighted fields.' });
	}

	let booking;
	for (let attempt = 0; attempt < 3; attempt++) {
		try {
			booking = await Booking.create({
				...values,
				phone,
				email: values.email || undefined,
				serviceName: service.name,
				preferredDate,
				statusHistory: [{ status: 'new', by: 'customer' }]
			});
			break;
		} catch (err) {
			if (err?.code !== 11000 || attempt === 2) {
				console.error('[booking]', err);
				return fail(500, {
					values,
					message: 'We could not save your request just now. Please try again, or send it to us on WhatsApp.'
				});
			}
		}
	}

	return {
		success: true,
		ref: booking.ref,
		summary: {
			service: service.name,
			frequency: values.frequency,
			requestType: values.requestType,
			preferredDate: values.preferredDate,
			preferredTime: values.preferredTime,
			name: values.fullName,
			area: values.area
		}
	};
}
