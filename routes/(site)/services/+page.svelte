<script>
	import { Check } from '@lucide/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ServiceIcon from '$lib/components/ServiceIcon.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import WhatsAppButton from '$lib/components/WhatsAppButton.svelte';
	import { breadcrumbSchema, serviceSchema } from '$lib/seo.js';
	import { waMessage } from '$lib/whatsapp.js';

	let { data } = $props();
	const crumbs = [
		{ name: 'Home', path: '/' },
		{ name: 'Services', path: '/services' }
	];
</script>

<Seo
	seo={data.seo}
	path="/services"
	jsonld={[breadcrumbSchema(crumbs, data.siteUrl), ...data.fullServices.map((s) => serviceSchema(s, data.siteUrl))]}
/>

<section class="wrap pt-10 pb-16 sm:pt-14">
	<Breadcrumbs items={crumbs} />
	<h1 class="display mt-8 max-w-4xl text-[clamp(2.6rem,6vw,5rem)]">Cleaning services in Minna</h1>
	<p class="lede mt-6">
		Homes, offices, new builds and laundry — handled by one dependable team. Choose a service to see exactly what it covers,
		or book it as a one-time clean or a regular plan.
	</p>
	<nav class="mt-8 flex flex-wrap gap-2" aria-label="Jump to a service">
		{#each data.fullServices as s}
			<a href="#{s.slug}" class="rounded-full border-2 border-line px-4 py-2 text-sm font-semibold hover:border-ink">{s.name}</a>
		{/each}
	</nav>
</section>

<div class="wrap space-y-6 pb-24">
	{#each data.fullServices as s, i (s._id)}
		<article id={s.slug} class="scroll-mt-28 overflow-hidden rounded-[2rem] {i % 2 === 0 ? 'bg-mist' : 'border-2 border-line'}">
			<div class="grid lg:grid-cols-[1fr_1.15fr]">
				<div class="p-7 sm:p-10 lg:p-12">
					<span class="grid h-16 w-16 place-items-center rounded-2xl bg-sun"><ServiceIcon name={s.icon} size={30} /></span>
					<h2 class="headline mt-6 text-3xl sm:text-4xl">{s.name}</h2>
					<p class="mt-4 max-w-[58ch] text-slate">{s.shortDescription}</p>
					{#if s.priceInfo}<p class="mt-4 font-semibold">{s.priceInfo}</p>{/if}
					<div class="mt-8 flex flex-wrap gap-3">
						<a href="/services/{s.slug}" class="btn btn-ink">See full details</a>
						<a href="/book?service={s.slug}" class="btn btn-sun">Book this service</a>
					</div>
					<div class="mt-4">
						<WhatsAppButton
							message={waMessage.service(s.name, data.settings.businessName)}
							label="Ask about {s.name.toLowerCase()}"
							class="inline-flex items-center gap-2 text-sm font-semibold text-[#177040] hover:underline"
						/>
					</div>
				</div>
				<div class="flex flex-col justify-center p-7 sm:p-10 lg:p-12 {s.image ? '' : 'lg:border-l-2 lg:border-paper'}">
					{#if s.image}
						<img src={s.image} alt={s.imageAlt || `${s.name} by BiceMeek in Minna`} loading="lazy" decoding="async" class="aspect-[4/3] w-full rounded-3xl object-cover" />
					{:else}
						<h3 class="text-sm font-bold text-slate">What’s included</h3>
						<ul class="mt-4 space-y-3">
							{#each s.covers.slice(0, 6) as c}
								<li class="flex gap-3"><Check size={20} class="mt-0.5 shrink-0 text-sun-deep" strokeWidth={3} aria-hidden="true" /><span>{c}</span></li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</article>
	{/each}
</div>

<CtaBand
	title="Not sure which service you need?"
	text="Describe your space and we’ll recommend the right clean — and whether a regular plan would save you money."
/>
