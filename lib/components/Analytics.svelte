<script>
	/**
	 * Loads GA4 only when a measurement ID is configured.
	 * GA4's enhanced measurement ("page changes based on browser history events", on by default)
	 * records client-side navigations, so no manual page_view events are sent here.
	 */
	let { id = '' } = $props();
	const valid = $derived(/^G-[A-Z0-9]{4,12}$/.test(id));
	const S = '<' + 'script';
	const E = '</' + 'script>';
	const tag = $derived(
		valid
			? `${S} async src="https://www.googletagmanager.com/gtag/js?id=${id}">${E}` +
					`${S}>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');${E}`
			: ''
	);

</script>

<svelte:head>
	{#if valid}{@html tag}{/if}
</svelte:head>
