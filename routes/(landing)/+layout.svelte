<script>
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';
	import WhatsAppButton from '$lib/components/WhatsAppButton.svelte';
	import { formatPhone } from '$lib/whatsapp.js';

	// Distraction-free shell for ad and social traffic: no main navigation.
	let { data, children } = $props();
</script>

<header class="absolute inset-x-0 top-0 z-30">
	<div class="wrap flex h-20 items-center justify-between">
		<a href="/" aria-label="{data.settings.businessName} home"><Logo tone="light" /></a>
		<WhatsAppButton message={page.data.waMessage} label="WhatsApp" class="btn btn-wa btn-sm" />
	</div>
</header>

<main id="main">
	{@render children()}
</main>

<footer class="bg-ink pb-28 text-sm text-paper/60 sm:pb-10">
	<div class="wrap flex flex-col gap-3 border-t border-paper/15 pt-8 sm:flex-row sm:justify-between">
		<p>© {new Date().getFullYear()} {data.settings.businessName}. {data.settings.fullAddress}.</p>
		<p class="flex flex-wrap gap-4">
			{#each data.settings.phones as p}<span>{formatPhone(p)}</span>{/each}
			<a href="/privacy-policy" class="underline hover:text-paper">Privacy</a>
			<a href="/" class="underline hover:text-paper">Main website</a>
		</p>
	</div>
</footer>
