// Default content written for BiceMeek. Everything here is editable in the admin dashboard.
// No prices, certifications or customer reviews are invented.

export const DEFAULT_SETTINGS = {
	key: 'site',
	businessName: 'BiceMeek Cleaning Services',
	tagline: 'A Cleaner Space. A Brighter You!',
	slogan: 'We Clean. You Relax. We Make It BiceMeek!',
	phones: ['+2347016890048', '+2349051998841'],
	whatsapp: [
		{ label: 'Bookings line', number: '2347016890048' },
		{ label: 'Second line', number: '2349051998841' }
	],
	email: '',
	streetAddress: 'Mandela Road, after Tee Mama Junction',
	city: 'Minna',
	state: 'Niger State',
	country: 'Nigeria',
	mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mandela+Road+Tee+Mama+Junction+Minna+Niger+State',
	googleBusinessUrl: '',
	openingHours: [],
	social: { facebook: '', instagram: '', tiktok: '', x: '', linkedin: '', youtube: '' },
	heroImage: '',
	heroImageAlt: '',
	aboutImage: '',
	defaultOgImage: '',
	gaMeasurementId: '',
	googleSiteVerification: ''
};

export const DEFAULT_SERVICES = [
	{
		slug: 'residential-cleaning',
		name: 'Residential Cleaning',
		icon: 'home',
		order: 1,
		shortDescription: 'Spotless homes, healthy living. Routine cleaning for flats, bungalows and duplexes across Minna.',
		description:
			'Your home should be the place you rest, not another list of chores. Our residential cleaning keeps living rooms, bedrooms, kitchens and bathrooms fresh and orderly, whether you live in a one-room apartment or a family duplex. We bring our own supplies, work to a checklist you can see, and leave the space ready for you to enjoy.',
		covers: [
			'Dusting of surfaces, shelves, switches and skirting',
			'Sweeping and mopping of all floors',
			'Kitchen wipe-down: counters, cabinet fronts, sink and cooker top',
			'Bathroom and toilet cleaning and disinfecting',
			'Bed making and tidying of living areas',
			'Emptying of bins and replacing liners'
		],
		idealFor: [
			'Busy professionals and working parents',
			'Families who want a reliable weekly routine',
			'Landlords preparing a home for guests or tenants',
			'Elderly residents who need a helping hand'
		],
		benefits: [
			'Get your evenings and weekends back',
			'Less dust and fewer germs around your family',
			'A consistent standard every visit',
			'Supplies and equipment brought by our team'
		],
		priceInfo: 'Priced by home size and frequency — request a free quote.',
		seoTitle: 'House Cleaning in Minna | Residential Cleaning Services',
		seoDescription:
			'Professional residential cleaning in Minna, Niger State. Reliable house cleaning for flats, bungalows and duplexes — one-time, weekly or monthly.'
	},
	{
		slug: 'office-cleaning',
		name: 'Office & Commercial Cleaning',
		icon: 'building',
		order: 2,
		shortDescription: 'Clean spaces, productive places. Scheduled cleaning for offices, shops and business premises.',
		description:
			'First impressions are made at your front door. We keep offices, shops, banking halls, schools and other business premises clean, hygienic and presentable, on a schedule that works around your opening hours. From reception to restrooms, your staff and customers walk into a space that reflects how seriously you take your business.',
		covers: [
			'Workstations, desks and meeting rooms',
			'Reception and customer-facing areas',
			'Restrooms cleaned and disinfected',
			'Kitchenettes and staff break areas',
			'Floor care for tiles, terrazzo and rugs',
			'Glass doors, partitions and interior windows',
			'Waste collection and bin sanitising'
		],
		idealFor: [
			'Corporate and government offices',
			'Shops, supermarkets and showrooms',
			'Schools, clinics and training centres',
			'Banks, hotels and event venues'
		],
		benefits: [
			'A healthier workplace with fewer sick days',
			'A professional look for clients and visitors',
			'Cleaning scheduled before, during or after work hours',
			'One dependable team instead of ad-hoc cleaners'
		],
		priceInfo: 'Custom quotation based on floor area and schedule.',
		seoTitle: 'Office Cleaning in Minna | Commercial Cleaning Services',
		seoDescription:
			'Office and commercial cleaning in Minna, Niger State. Daily, weekly or monthly cleaning for offices, shops, schools and business premises.'
	},
	{
		slug: 'post-construction-cleaning',
		name: 'Post-Construction Cleaning',
		icon: 'hard-hat',
		order: 3,
		shortDescription: 'We clean up, you move in. Thorough clean-up after building, renovation and remodelling work.',
		description:
			'Construction leaves behind cement dust, paint splashes, tile grout and debris that ordinary cleaning cannot handle. Our post-construction team removes it carefully so your new or renovated property is ready to hand over, move into or open for business. We work with homeowners, developers, contractors and facility managers.',
		covers: [
			'Removal of light debris and packaging',
			'Cement, paint and grout residue removal from floors and tiles',
			'Window, frame and burglar-proof cleaning',
			'Dust removal from walls, ceilings, fittings and fixtures',
			'Kitchen and bathroom detailing',
			'Final wipe-down ready for handover'
		],
		idealFor: [
			'Property developers and contractors',
			'Homeowners after a renovation',
			'Offices and shops before opening',
			'Estate and facility managers'
		],
		benefits: [
			'Hand over projects in move-in condition',
			'Protect new finishes from scratches and stains',
			'Save your site team days of clean-up',
			'Safer spaces free of sharp debris and fine dust'
		],
		priceInfo: 'Quoted per project after a site assessment.',
		seoTitle: 'Post-Construction Cleaning in Minna | After-Build Cleaning',
		seoDescription:
			'Post-construction and after-renovation cleaning in Minna, Niger State. Cement, paint and dust removal for homes, offices and new builds.'
	},
	{
		slug: 'deep-cleaning',
		name: 'Deep Cleaning',
		icon: 'sparkles',
		order: 4,
		shortDescription: 'Thorough cleaning, total freshness. A top-to-bottom clean for spaces that need extra attention.',
		description:
			'Deep cleaning goes beyond the routine to reach the places that build up grime over months: behind appliances, inside cabinets, along grout lines and on high surfaces. It is ideal after harmattan, before a celebration, or when a space simply needs a fresh start. Many customers book a deep clean first, then keep things fresh with a weekly or monthly plan.',
		covers: [
			'Everything in a standard clean, plus:',
			'Behind and under furniture and appliances',
			'Inside kitchen cabinets, drawers and wardrobes (emptied)',
			'Scrubbing of tile grout, sinks and shower areas',
			'Descaling of taps and bathroom fittings',
			'Ceiling fans, light fittings and high surfaces',
			'Doors, frames, window sills and burglar-proofs'
		],
		idealFor: [
			'Homes after harmattan dust season',
			'Spaces that have not been cleaned in a while',
			'Preparing for festive seasons, events or guests',
			'A fresh start before beginning a regular plan'
		],
		benefits: [
			'Removes built-up dust, grease and limescale',
			'Fresher air with fewer allergens',
			'Makes routine cleaning faster afterwards',
			'Restores the look of tiles, fittings and surfaces'
		],
		priceInfo: 'Priced by property size and condition.',
		seoTitle: 'Deep Cleaning Services in Minna | Thorough Home & Office Cleaning',
		seoDescription:
			'Deep cleaning in Minna, Niger State for homes and offices. Grease, grime, dust and limescale removed from top to bottom.'
	},
	{
		slug: 'move-in-move-out-cleaning',
		name: 'Move-In / Move-Out Cleaning',
		icon: 'truck',
		order: 5,
		shortDescription: 'We make transitions easy. An empty-property clean before you move in or after you move out.',
		description:
			'Moving is stressful enough. Whether you are collecting new keys or handing old ones back, we clean the empty property thoroughly so you can settle in with confidence or leave it in the condition your landlord expects. Landlords and agents also use this service between tenants.',
		covers: [
			'Full clean of empty rooms, walls and floors',
			'Inside wardrobes, cabinets and drawers',
			'Kitchen degreasing and appliance wipe-down',
			'Bathrooms and toilets disinfected',
			'Windows, sills, doors and switches',
			'Removal of light rubbish left behind'
		],
		idealFor: [
			'Tenants moving into a new home',
			'Tenants moving out and handing over',
			'Landlords and property agents between lets',
			'Buyers preparing a newly purchased home'
		],
		benefits: [
			'Start life in your new home with a clean slate',
			'Hand over your old home in good condition',
			'Faster turnaround between tenants',
			'One less job on your moving checklist'
		],
		priceInfo: 'Priced by number of rooms.',
		seoTitle: 'Move-In & Move-Out Cleaning in Minna | End of Tenancy Cleaning',
		seoDescription:
			'Move-in and move-out cleaning in Minna, Niger State. Empty-property cleaning for tenants, landlords and property agents.'
	},
	{
		slug: 'laundry',
		name: 'Laundry Services',
		icon: 'shirt',
		order: 6,
		shortDescription: 'Clean. Fresh. Perfectly cared for. Washing, drying and ironing handled for you.',
		description:
			'Hand your laundry over and get it back clean, fresh and neatly finished. We sort, wash, dry and iron everyday clothing, bedding and household linen with care for fabrics and colours. Laundry can be booked on its own or added to a home cleaning visit. Tell us about any special items when you book and we will confirm how we can handle them.',
		covers: [
			'Sorting by colour and fabric',
			'Washing and drying of everyday clothing',
			'Ironing and neat folding',
			'Bedsheets, duvet covers, towels and curtains',
			'Native attire and corporate wear on request'
		],
		idealFor: [
			'Busy individuals and families',
			'Students and young professionals',
			'Guest houses and short-let apartments',
			'Offices that need linen and uniforms cared for'
		],
		benefits: [
			'Hours saved every week',
			'Clothes handled with care for fabric and colour',
			'Crisp, ready-to-wear finish',
			'Easy to add to a regular cleaning plan'
		],
		priceInfo: 'Priced per item or per load — ask for our current list.',
		seoTitle: 'Laundry Services in Minna | Washing, Drying & Ironing',
		seoDescription:
			'Laundry services in Minna, Niger State. Washing, drying, ironing and folding for clothes, bedding and household linen.'
	}
];

export const DEFAULT_PLANS = [
	{
		key: 'daily',
		name: 'Daily Cleaning',
		order: 1,
		tagline: 'For spaces that are busy every single day.',
		description:
			'A cleaner visits on the days you choose to keep your home or workplace consistently tidy, hygienic and ready for people. Best where foot traffic, children, customers or staff make mess build up quickly.',
		bestFor: 'Offices, shops, clinics, large family homes and short-let apartments',
		price: null,
		priceUnit: 'per month',
		priceNote: 'Priced to your space and the days you need.',
		inclusions: [
			'Visits on your chosen days of the week',
			'Floors swept and mopped',
			'Kitchen and toilets cleaned and disinfected',
			'Surfaces dusted and wiped',
			'Bins emptied and refreshed',
			'Same familiar cleaner wherever possible'
		],
		highlighted: false,
		enabled: true
	},
	{
		key: 'weekly',
		name: 'Weekly Cleaning',
		order: 2,
		tagline: 'The routine most homes need.',
		description:
			'A thorough clean once a week, on the same day, so your space never gets out of hand. The most popular choice for households that want to stop spending weekends on chores.',
		bestFor: 'Family homes, apartments and small offices',
		price: null,
		priceUnit: 'per month',
		priceNote: 'Four or five visits a month, depending on the calendar.',
		inclusions: [
			'One scheduled visit every week',
			'Full clean of living areas, bedrooms, kitchen and bathrooms',
			'Dusting of furniture, fittings and high-touch points',
			'Floor care throughout',
			'Rotating extra task each visit (e.g. fridge, windows)',
			'Laundry add-on available'
		],
		highlighted: true,
		enabled: true
	},
	{
		key: 'monthly',
		name: 'Monthly Cleaning',
		order: 3,
		tagline: 'A dependable reset, once a month.',
		description:
			'A scheduled monthly visit that goes deeper than a quick tidy-up. Ideal if you keep on top of daily tasks yourself but want a professional team to handle the heavier cleaning regularly.',
		bestFor: 'Smaller homes, tidy households and occasional-use spaces',
		price: null,
		priceUnit: 'per visit',
		priceNote: 'Pick a fixed date each month.',
		inclusions: [
			'One scheduled visit each month',
			'Detailed kitchen and bathroom clean',
			'Dusting of high and hard-to-reach areas',
			'Floors scrubbed and mopped',
			'Window sills, doors and switches wiped',
			'Option to upgrade any visit to a deep clean'
		],
		highlighted: false,
		enabled: true
	}
];

export const DEFAULT_SEO = {
	home: {
		title: 'Cleaning Services in Minna | BiceMeek Cleaning Services',
		description:
			'Professional home, office, deep and post-construction cleaning in Minna, Niger State. Book a one-time clean or a daily, weekly or monthly cleaning plan.',
		keywords:
			'cleaning services in Minna, house cleaning Minna, office cleaning Minna, deep cleaning Minna, cleaning company Niger State'
	},
	about: {
		title: 'About BiceMeek | Professional Cleaners in Minna, Niger State',
		description:
			'Meet BiceMeek Cleaning Services — a Minna cleaning company built on reliability, hygiene, punctuality and customer satisfaction.',
		keywords: 'cleaning company Minna, professional cleaners Niger State'
	},
	services: {
		title: 'Cleaning Services in Minna | Residential, Office, Deep & More',
		description:
			'Explore BiceMeek’s cleaning services in Minna: residential, office and commercial, post-construction, deep cleaning, move-in/move-out and laundry.',
		keywords: 'cleaning services Minna, residential cleaning Minna, office cleaning Minna, laundry services Minna'
	},
	'cleaning-plans': {
		title: 'Daily, Weekly & Monthly Cleaning Plans in Minna | BiceMeek',
		description:
			'Recurring home and office cleaning in Minna. Choose a daily, weekly or monthly cleaning plan and request a custom quotation today.',
		keywords: 'weekly house cleaning Minna, monthly cleaning services Minna, daily office cleaning Minna'
	},
	'cleaning-subscription': {
		title: 'Never Worry About Cleaning Again | BiceMeek Cleaning Plans, Minna',
		description:
			'Get your home or office cleaned on a schedule — daily, weekly or monthly. Request your free quote from BiceMeek Cleaning Services in Minna.',
		keywords: 'cleaning subscription Minna, regular cleaner Minna, house cleaner Minna'
	},
	book: {
		title: 'Book a Cleaning in Minna | BiceMeek Cleaning Services',
		description:
			'Request a cleaning booking or a free quotation in Minna, Niger State. Choose your service, frequency, date and time.',
		keywords: 'book cleaner Minna, cleaning quote Minna'
	},
	gallery: {
		title: 'Our Work | Cleaning Project Gallery — BiceMeek, Minna',
		description:
			'Photos and videos of cleaning projects by BiceMeek Cleaning Services across Minna — homes, offices, post-construction and more.',
		keywords: 'cleaning before and after Minna'
	},
	testimonials: {
		title: 'Customer Reviews | BiceMeek Cleaning Services, Minna',
		description: 'What customers say about BiceMeek Cleaning Services in Minna, Niger State.',
		keywords: 'cleaning company reviews Minna'
	},
	contact: {
		title: 'Contact BiceMeek | Cleaning Services on Mandela Road, Minna',
		description:
			'Call or WhatsApp BiceMeek Cleaning Services. Find us on Mandela Road, after Tee Mama Junction, Minna, Niger State.',
		keywords: 'cleaning company contact Minna'
	}
};

// Clearly marked demonstration content — saved UNPUBLISHED so it never appears on the live site
// unless an admin deliberately edits and publishes it. Replace with real customer feedback.
export const DEMO_TESTIMONIALS = [
	{
		name: 'Demo review — replace me',
		location: 'Minna',
		service: 'Weekly Cleaning',
		rating: 5,
		text: 'This is sample text showing how a review will look. Replace it with real feedback from a BiceMeek customer before publishing.',
		isDemo: true,
		published: false
	},
	{
		name: 'Demo review — replace me',
		location: 'Minna',
		service: 'Post-Construction Cleaning',
		rating: 5,
		text: 'Sample review for layout purposes only. Add genuine customer words, with their permission, then switch this to published.',
		isDemo: true,
		published: false
	}
];
