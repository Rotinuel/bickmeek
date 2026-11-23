<script>
	import { Check, ArrowUpRight } from '@lucide/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ServiceIcon from '$lib/components/ServiceIcon.svelte';
	import BookingForm from '$lib/components/BookingForm.svelte';
	import WhatsAppButton from '$lib/components/WhatsAppButton.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import { GENERAL_FAQS } from '$lib/content.js';
	import { breadcrumbSchema, serviceSchema } from '$lib/seo.js';

	let { data } = $props();
	const s = $derived(data.service);
	const crumbs = $derived([
		{ name: 'Home', path: '/' },
		{ name: 'Services', path: '/services' },
		{ name: s.name, path: `/services/${s.slug}` }
	]);
	const paragraphs = $derived((s.description || '').split(/\n{2,}/).filter(Boolean));
</script>

<Seo seo={data.seo} path="/services/{s.slug}" jsonld={[serviceSchema(s, data.siteUrl), breadcrumbSchema(crumbs, data.siteUrl)]} />

<section class="wrap pt-10 pb-16 sm:pt-14">
	<Breadcrumbs items={crumbs} />
	<div class="mt-8 grid items-start gap-12 lg:grid-cols-[1.25fr_1fr]">
		<div>
			<span class="grid h-16 w-16 place-items-center rounded-2xl bg-sun"><ServiceIcon name={s.icon} size={30} /></span>
			<h1 class="display mt-6 text-[clamp(2.5rem,5.6vw,4.6rem)]">{s.name} in Minna</h1>
			<p class="lede mt-6">{s.shortDescription}</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<a href="#request" class="btn btn-sun">Request this service</a>
				<WhatsAppButton message={data.waMessage} label="Ask on WhatsApp" />
			</div>
			{#if s.priceInfo}<p class="mt-6 font-semibold">{s.priceInfo}</p>{/if}
		</div>
		{#if s.image}
			<img src={s.image} alt={s.imageAlt || `${s.name} by BiceMeek`} class="aspect-[4/3] w-full rounded-[var(--radius-blob)] object-cover" fetchpriority="high" />
		{:else}
			<div class="rounded-[var(--radius-blob)] bg-ink p-8 text-paper sm:p-10">
				<p class="text-sm font-bold text-sun">Who it’s for</p>
				<ul class="mt-5 space-y-4">
					{#each s.idealFor as item}
						<li class="flex gap-3 text-lg"><Check size={22} class="mt-1 shrink-0 text-sun" strokeWidth={3} aria-hidden="true" />{item}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</section>

<section class="bg-mist py-20" aria-labelledby="about-service">
	<div class="wrap grid gap-14 lg:grid-cols-2">
		<div>
			<h2 id="about-service" class="headline text-3xl sm:text-4xl">About this service</h2>
			{#each paragraphs as p}<p class="mt-4 max-w-[62ch] text-lg text-slate">{p}</p>{/each}
		</div>
		<div>
			<h2 class="headline text-3xl sm:text-4xl">What it covers</h2>
			<ul class="mt-6 space-y-3">
				{#each s.covers as c}
					<li class="flex gap-3 rounded-2xl bg-paper px-5 py-4">
						<Check size={20} class="mt-0.5 shrink-0 text-sun-deep" strokeWidth={3} aria-hidden="true" /><span>{c}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<section class="py-20" aria-labelledby="benefits-title">
	<div class="wrap grid gap-14 lg:grid-cols-2">
		<div>
			<h2 id="benefits-title" class="headline text-3xl sm:text-4xl">Why book it</h2>
			<ul class="mt-6 grid gap-4 sm:grid-cols-2">
				{#each s.benefits as b}
					<li class="border-l-4 border-sun py-1 pl-4 font-semibold">{b}</li>
				{/each}
			</ul>
		</div>
		{#if s.image}
			<div>
				<h2 class="headline text-3xl sm:text-4xl">Who it’s for</h2>
				<ul class="mt-6 space-y-3">
					{#each s.idealFor as item}<li class="flex gap-3"><Check size={20} class="mt-0.5 shrink-0" strokeWidth={3} aria-hidden="true" />{item}</li>{/each}
				</ul>
			</div>
		{:else}
			<div class="rounded-[2rem] bg-sun p-8 sm:p-10">
				<h2 class="headline text-2xl">Need it regularly?</h2>
				<p class="mt-3 text-ink/80">Book {s.name.toLowerCase()} on a daily, weekly or monthly schedule and stop arranging cleaners every time.</p>
				<a href="/cleaning-plans" class="btn btn-ink mt-6">See cleaning plans</a>
			</div>
		{/if}
	</div>
</section>

<section id="request" class="scroll-mt-20 bg-ink py-20 text-paper" aria-label="Request {s.name}">
	<div class="wrap grid gap-12 lg:grid-cols-[1fr_1.3fr]">
		<div>
			<h2 class="display text-[clamp(2rem,4vw,3.2rem)]">Request {s.name.toLowerCase()}</h2>
			<p class="mt-4 max-w-[44ch] text-lg text-paper/70">Fill in the form and our team will contact you with a confirmed date and quotation.</p>
		</div>
		<div class="rounded-[2rem] bg-graphite p-6 sm:p-10">
			{#key s.slug}
				<BookingForm services={data.services} service={s.slug} tone="dark" source="service:{s.slug}" heading="" />
			{/key}
		</div>
	</div>
</section>

<section class="py-20" aria-labelledby="faq-title">
	<div class="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr]">
		<h2 id="faq-title" class="headline text-3xl sm:text-4xl">Common questions</h2>
		<Faq faqs={GENERAL_FAQS.slice(0, 4)} />
	</div>
</section>

{#if data.related.length}
	<section class="bg-mist py-16" aria-labelledby="related-title">
		<div class="wrap">
			<h2 id="related-title" class="headline text-2xl">Other services</h2>
			<ul class="mt-6 grid gap-4 md:grid-cols-3">
				{#each data.related as r}
					<li>
						<a href="/services/{r.slug}" class="group flex h-full items-start justify-between gap-4 rounded-3xl bg-paper p-6 hover:ring-2 hover:ring-ink">
							<span>
								<ServiceIcon name={r.icon} size={26} />
								<span class="mt-3 block text-lg font-bold">{r.name}</span>
							</span>
							<ArrowUpRight size={22} class="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}
