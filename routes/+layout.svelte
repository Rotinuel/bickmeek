<script>
	import '$lib/styles/app.css';
	import { page } from '$app/state';
	import Analytics from '$lib/components/Analytics.svelte';

	let { data, children } = $props();
	const isAdmin = $derived(page.url.pathname.startsWith('/admin'));
</script>

<svelte:head>
	{#if data.settings.googleSiteVerification && !isAdmin}
		<meta name="google-site-verification" content={data.settings.googleSiteVerification} />
	{/if}
</svelte:head>

{#if !isAdmin}
	<Analytics id={data.settings.gaMeasurementId} />
{/if}

{@render children()}
