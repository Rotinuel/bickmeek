<script>
	import { page } from '$app/state';

	/**
	 * Per-page metadata. `seo` comes from the SEO admin (title, description, keywords, ogImage).
	 * `jsonld` is an array of structured-data objects.
	 */
	let { seo = {}, path = null, jsonld = [], noindex = false, type = 'website' } = $props();

	const settings = $derived(page.data.settings ?? {});
	const base = $derived(page.data.siteUrl ?? page.url.origin);
	const title = $derived(seo.title || settings.businessName || 'BiceMeek Cleaning Services');
	const description = $derived(seo.description || '');
	const canonical = $derived(`${base}${path ?? page.url.pathname}`.replace(/(?<=.)\/$/, ''));
	const ogRaw = $derived(seo.ogImage || settings.defaultOgImage || '/og-default.jpg');
	const ogImage = $derived(ogRaw.startsWith('http') ? ogRaw : `${base}${ogRaw}`);
	// Built here (not in markup) so no literal script tags appear in the template.
	const OPEN = '<' + 'script type="application/ld+json">';
	const CLOSE = '</' + 'script>';
	const ldHtml = $derived(
		jsonld
			.filter(Boolean)
			.map((o) => OPEN + JSON.stringify(o).replace(/</g, '\\u003c') + CLOSE)
			.join('')
	);
</script>

<svelte:head>
	<title>{title}</title>
	{#if description}<meta name="description" content={description} />{/if}
	{#if seo.keywords}<meta name="keywords" content={seo.keywords} />{/if}
	<link rel="canonical" href={canonical} />
	{#if noindex}<meta name="robots" content="noindex, nofollow" />{/if}

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={settings.businessName} />
	<meta property="og:locale" content="en_NG" />
	<meta property="og:title" content={title} />
	{#if description}<meta property="og:description" content={description} />{/if}
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	{#if description}<meta name="twitter:description" content={description} />{/if}
	<meta name="twitter:image" content={ogImage} />

	{@html ldHtml}
</svelte:head>
