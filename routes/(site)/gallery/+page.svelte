<script>
	import { Camera } from '@lucide/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import WhatsAppButton from '$lib/components/WhatsAppButton.svelte';
	import { breadcrumbSchema } from '$lib/seo.js';

	let { data } = $props();
	const crumbs = [
		{ name: 'Home', path: '/' },
		{ name: 'Our work', path: '/gallery' }
	];
</script>

<Seo seo={data.seo} path="/gallery" jsonld={[breadcrumbSchema(crumbs, data.siteUrl)]} />

<section class="wrap pt-10 pb-24 sm:pt-14">
	<Breadcrumbs items={crumbs} />
	<h1 class="display mt-8 max-w-4xl text-[clamp(2.6rem,6vw,5rem)]">Our work across Minna</h1>
	<p class="lede mt-5">Homes, offices and building sites cleaned by our team. Filter by service, tap a photo to enlarge it, or drag a before-and-after slider.</p>

	<div class="mt-12">
		{#if data.items.length}
			<GalleryGrid items={data.items} />
		{:else}
			<div class="flex flex-col items-start gap-5 rounded-[2rem] bg-mist p-10">
				<Camera size={40} aria-hidden="true" />
				<h2 class="headline text-2xl">New project photos are on the way</h2>
				<p class="max-w-[52ch] text-slate">We’re adding photos and videos from recent jobs. Ask us on WhatsApp and we’ll share examples of work like yours.</p>
				<WhatsAppButton message="Hello BiceMeek Cleaning Services, could you share photos of your recent cleaning work?" label="Ask for examples" />
			</div>
		{/if}
	</div>
</section>

<CtaBand title="Want results like these?" />
