<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import TestimonialList from '$lib/components/TestimonialList.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import WhatsAppButton from '$lib/components/WhatsAppButton.svelte';
	import { breadcrumbSchema } from '$lib/seo.js';

	let { data } = $props();
	const crumbs = [
		{ name: 'Home', path: '/' },
		{ name: 'Reviews', path: '/testimonials' }
	];
</script>

<Seo seo={data.seo} path="/testimonials" jsonld={[breadcrumbSchema(crumbs, data.siteUrl)]} />

<section class="wrap pt-10 pb-24 sm:pt-14">
	<Breadcrumbs items={crumbs} />
	<h1 class="display mt-8 max-w-4xl text-[clamp(2.6rem,6vw,5rem)]">What our customers say</h1>

	{#if data.testimonials.length}
		<p class="lede mt-5">Feedback shared by homes and businesses we clean in Minna.</p>
		<div class="mt-12"><TestimonialList items={data.testimonials} /></div>
	{:else}
		<p class="lede mt-5">Customer reviews will appear here as they come in.</p>
	{/if}

	<div class="mt-14 flex flex-col gap-4 rounded-[2rem] bg-sun p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
		<div>
			<h2 class="headline text-2xl">Had a BiceMeek clean recently?</h2>
			<p class="mt-2 text-ink/80">We’d love to hear how it went. Your feedback helps us improve and helps others choose.</p>
		</div>
		<WhatsAppButton
			message="Hello BiceMeek Cleaning Services, I'd like to share feedback about my cleaning."
			label="Share your feedback"
			class="btn btn-ink shrink-0"
		/>
	</div>
</section>

<CtaBand />
