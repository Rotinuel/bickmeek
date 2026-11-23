import { Admin, Plan, SeoPage, Service, Settings, Testimonial } from './models.js';
import { hashPassword } from './password.js';
import {
	DEFAULT_PLANS,
	DEFAULT_SEO,
	DEFAULT_SERVICES,
	DEFAULT_SETTINGS,
	DEMO_TESTIMONIALS
} from './seed-data.js';

/**
 * Inserts default content into empty collections and creates the first admin
 * from ADMIN_EMAIL / ADMIN_PASSWORD when no admin exists. Safe to run repeatedly:
 * it never overwrites anything an admin has edited.
 */
export async function bootstrap({ adminEmail, adminPassword, adminName, log = () => {} } = {}) {
	const [settings, services, plans, seo, testimonials, admins] = await Promise.all([
		Settings.countDocuments(),
		Service.countDocuments(),
		Plan.countDocuments(),
		SeoPage.countDocuments(),
		Testimonial.countDocuments(),
		Admin.countDocuments()
	]);

	if (!settings) {
		await Settings.create(DEFAULT_SETTINGS);
		log('Created default site settings');
	}
	if (!services) {
		await Service.insertMany(DEFAULT_SERVICES);
		log(`Created ${DEFAULT_SERVICES.length} services`);
	}
	if (!plans) {
		await Plan.insertMany(DEFAULT_PLANS);
		log('Created daily, weekly and monthly plans');
	}
	if (!seo) {
		await SeoPage.insertMany(Object.entries(DEFAULT_SEO).map(([page, v]) => ({ page, ...v })));
		log('Created default SEO settings');
	}
	if (!testimonials) {
		await Testimonial.insertMany(DEMO_TESTIMONIALS);
		log('Created 2 unpublished demo testimonials');
	}
	if (!admins) {
		if (adminEmail && adminPassword && adminPassword.length >= 12) {
			await Admin.create({
				name: adminName || 'Administrator',
				email: adminEmail.toLowerCase().trim(),
				passwordHash: await hashPassword(adminPassword)
			});
			log(`Created admin account ${adminEmail}`);
		} else {
			log('No admin account yet. Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) to create one.');
		}
	}
}
