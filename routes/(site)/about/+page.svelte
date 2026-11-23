<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CtaBand from '$lib/components/CtaBand.svelte';
	import ValueIcon from '$lib/components/ValueIcon.svelte';
	import { VALUES } from '$lib/content.js';
	import { breadcrumbSchema } from '$lib/seo.js';

	let { data } = $props();
	const s = $derived(data.settings);
	const crumbs = [
		{ name: 'Home', path: '/' },
		{ name: 'About us', path: '/about' }
	];

	const standards = [
		{ title: 'A checklist for every job', text: 'Each service has a written scope. You know what will be cleaned before we start, and you can check it when we finish.' },
		{ title: 'Colour-coded cloths', text: 'Separate cloths and tools for kitchens, bathrooms and general areas, so germs from one room don’t travel to another.' },
		{ title: 'High-touch points disinfected', text: 'Door handles, switches, taps, railings and remote controls get extra attention on every visit.' },
		{ title: 'Respect for your space', text: 'We handle your belongings with care, ask before moving anything delicate, and leave rooms arranged the way we found them.' },
		{ title: 'Products used with care', text: 'Cleaning products are chosen for the surface and used safely around children, pets and food areas. Ask us if you have preferences.' },
		{ title: 'Feedback acted on', text: 'Tell us what you’d like done differently. We note it on your booking so the next visit gets it right.' }
	];
</script>

<Seo seo={data.seo} path="/about" jsonld={[breadcrumbSchema(crumbs, data.siteUrl)]} />

<section class="wrap pt-10 pb-20 sm:pt-14">
	<Breadcrumbs items={crumbs} />
	<div class="mt-8 grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]">
		<h1 class="display text-[clamp(2.6rem,6vw,5rem)]">Clean spaces, run by people who care about the details.</h1>
		<p class="lede">
			{s.businessName} is a professional cleaning company based on Mandela Road, Minna. We clean homes, offices and
			business premises across the city — and we take the trust that comes with that seriously.
		</p>
	</div>
	{#if s.aboutImage}
		<img src={s.aboutImage} alt="The {s.businessName} team" class="mt-14 aspect-[21/9] w-full rounded-[var(--radius-blob)] object-cover" />
	{/if}
</section>

<section class="bg-mist py-20 sm:py-24">
	<div class="wrap grid gap-12 lg:grid-cols-2">
		<div class="prose-bm">
			<h2>Who we are</h2>
			<p>
				BiceMeek exists so that cleaning can be something you hand over completely — not something you have to
				supervise, chase or redo. Our team handles residential cleaning, office and commercial cleaning, post-construction
				clean-up, deep cleaning, move-in and move-out cleaning, and laundry.
			</p>
			<p>
				Many of our customers choose a daily, weekly or monthly plan so their space stays clean between visits. Others call
				us for a single deep clean before a celebration, after renovation work, or when they get the keys to a new home.
				Either way, the standard is the same.
			</p>
		</div>
		<div class="grid content-start gap-6 sm:grid-cols-2">
			<div class="rounded-[1.75rem] bg-ink p-7 text-paper">
				<h2 class="text-sm font-bold text-sun">Our mission</h2>
				<p class="mt-3 text-lg">To give every home and workplace in Minna a clean, healthy space — delivered reliably, safely and with respect.</p>
			</div>
			<div class="rounded-[1.75rem] bg-sun p-7">
				<h2 class="text-sm font-bold">Our vision</h2>
				<p class="mt-3 text-lg">To be the cleaning company Niger State families and businesses recommend first, because we are the one they never have to worry about.</p>
			</div>
		</div>
	</div>
</section>

<section class="py-20 sm:py-28" aria-labelledby="values-title">
	<div class="wrap">
		<h2 id="values-title" class="display text-[clamp(2rem,4.2vw,3.4rem)]">Our values</h2>
		<ul class="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
			{#each VALUES as v}
				<li>
					<span class="grid h-14 w-14 place-items-center rounded-2xl bg-sun"><ValueIcon name={v.icon} /></span>
					<h3 class="mt-5 text-xl font-bold">{v.title}</h3>
					<p class="mt-2 text-slate">{v.text}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section class="bg-ink py-20 text-paper sm:py-28" aria-labelledby="standards-title">
	<div class="wrap">
		<h2 id="standards-title" class="display max-w-3xl text-[clamp(2rem,4.2vw,3.4rem)]">Our cleaning standards</h2>
		<p class="mt-4 max-w-[58ch] text-lg text-paper/70">Hygiene and safety are built into how we work, not added at the end.</p>
		<ul class="mt-12 grid gap-px overflow-hidden rounded-[2rem] bg-paper/15 md:grid-cols-2 lg:grid-cols-3">
			{#each standards as st}
				<li class="bg-ink p-7 sm:p-8">
					<h3 class="text-xl font-bold text-sun">{st.title}</h3>
					<p class="mt-2 text-paper/75">{st.text}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section class="py-20 sm:py-28">
	<div class="wrap grid gap-12 lg:grid-cols-2">
		<div class="prose-bm">
			<h2>Our approach to customer satisfaction</h2>
			<p>
				Satisfaction starts before we arrive: we listen to what you need, agree the scope and price clearly, and confirm a
				time window. On the day, our team follows the agreed checklist. Afterwards, we want to hear from you.
			</p>
			<p>
				If anything on the agreed checklist was missed, tell us and we will work with you to put it right. That’s our
				promise: <strong>{s.slogan}</strong>
			</p>
		</div>
		<div class="prose-bm">
			<h2>Professional and reliable</h2>
			<p>
				Reliability means turning up when we said we would, doing what we agreed, and communicating if anything changes.
				For regular plans, we keep the same cleaner or team on your schedule wherever possible so they learn your space and
				your preferences.
			</p>
			<p>
				Whether you need us once or every day, you’ll deal with one accountable company — not a different stranger each time.
			</p>
		</div>
	</div>
</section>

<CtaBand />
