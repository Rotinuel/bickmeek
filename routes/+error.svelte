<script>
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';
	import WhatsAppButton from '$lib/components/WhatsAppButton.svelte';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Page not found' : 'Something went wrong'} · BiceMeek Cleaning Services</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="wrap flex min-h-screen flex-col justify-center py-16">
	<a href="/" class="mb-14 w-fit"><Logo /></a>
	<p class="display text-[clamp(5rem,18vw,12rem)] text-sun">{page.status}</p>
	<h1 class="headline mt-4 text-3xl sm:text-4xl">
		{page.status === 404 ? 'This page has been swept away.' : 'Something went wrong.'}
	</h1>
	<p class="lede mt-4">{page.error?.message}</p>
	<div class="mt-8 flex flex-wrap gap-3">
		<a href="/" class="btn btn-ink">Go to the homepage</a>
		<a href="/book" class="btn btn-ghost">Book a cleaning</a>
		<WhatsAppButton message="Hello BiceMeek Cleaning Services, I need some help." label="Ask on WhatsApp" />
	</div>
</main>
