// JSON-LD builders. Only facts the business has supplied are emitted.
// Note: schema.org has no "CleaningService" type; HomeAndConstructionBusiness (a LocalBusiness
// subtype) plus a Service per offering is the valid, accurate choice.

const abs = (base, path) => (path?.startsWith('http') ? path : `${base}${path || ''}`);

export function businessSchema(s, base) {
	const sameAs = Object.values(s.social || {}).filter(Boolean);
	if (s.googleBusinessUrl) sameAs.push(s.googleBusinessUrl);
	const data = {
		'@context': 'https://schema.org',
		'@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
		'@id': `${base}/#business`,
		name: s.businessName,
		slogan: s.tagline,
		description:
			'Professional residential, office, deep, post-construction, move-in/move-out cleaning and laundry services in Minna, Niger State.',
		url: `${base}/`,
		telephone: s.phones?.[0],
		address: {
			'@type': 'PostalAddress',
			streetAddress: s.streetAddress,
			addressLocality: s.city,
			addressRegion: s.state,
			addressCountry: 'NG'
		},
		areaServed: [
			{ '@type': 'City', name: 'Minna' },
			{ '@type': 'State', name: 'Niger State' }
		],
		hasMap: s.mapUrl || undefined,
		email: s.email || undefined,
		image: s.heroImage ? abs(base, s.heroImage) : `${base}/og-default.jpg`,
		logo: `${base}/logo.svg`,
		sameAs: sameAs.length ? sameAs : undefined,
		contactPoint: (s.whatsapp || []).map((w) => ({
			'@type': 'ContactPoint',
			telephone: `+${w.number}`,
			contactType: 'customer service',
			areaServed: 'NG',
			availableLanguage: ['English']
		}))
	};
	return data;
}

export function websiteSchema(s, base) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${base}/#website`,
		name: s.businessName,
		url: `${base}/`,
		inLanguage: 'en-NG',
		publisher: { '@id': `${base}/#business` }
	};
}

export function serviceSchema(service, base) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: service.name,
		serviceType: service.name,
		description: service.shortDescription || service.description,
		url: `${base}/services/${service.slug}`,
		image: service.image ? abs(base, service.image) : undefined,
		provider: { '@id': `${base}/#business` },
		areaServed: { '@type': 'City', name: 'Minna' }
	};
}

export function breadcrumbSchema(items, base) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: `${base}${item.path}`
		}))
	};
}

export function faqSchema(faqs) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	};
}
