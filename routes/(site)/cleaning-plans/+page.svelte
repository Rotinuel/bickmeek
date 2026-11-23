<script>
	import { tick } from 'svelte';
	import { CalendarX2, Clock4, UserX, Layers, Check } from '@lucide/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import PlanCompare from '$lib/components/PlanCompare.svelte';
	import BookingForm from '$lib/components/BookingForm.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import TestimonialList from '$lib/components/TestimonialList.svelte';
	import WhatsAppButton from '$lib/components/WhatsAppButton.svelte';
	import WhatsAppChooser from '$lib/components/WhatsAppChooser.svelte';
	import ValueIcon from '$lib/components/ValueIcon.svelte';
	import { PLAN_FAQS, PROCESS, VALUES } from '$lib/content.js';
	import { formatNaira } from '$lib/format.js';
	import { breadcrumbSchema, faqSchema } from '$lib/seo.js';

	let { data } = $props();
	let chosen = $state('weekly');

	const crumbs = [
		{ name: 'Home', path: '/' },
		{ name: 'Cleaning plans', path: '/cleaning-plans' }
	];

	const pains = [
		{ icon: CalendarX2, title: 'Weekends lost to chores', text: 'Saturday disappears into sweeping, mopping and scrubbing instead of rest or family time.' },
		{ icon: Layers, title: 'Mess builds up between cleans', text: 'Dust, harmattan haze and kitchen grease pile up faster than a once-in-a-while clean can fix.' },
		{ icon: UserX, title: 'Unreliable help', text: 'Casual cleaners who don’t show up, rush the job, or change every time.' },
		{ icon: Clock4, title: 'No time to manage it', text: 'Arranging, briefing and checking a cleaner each time becomes another job on your list.' }
	];

	const benefits = [
		'A fixed day and time window you can plan around',
		'The same trusted cleaner or team wherever possible',
		'A space that stays clean, not one that’s rescued once a month',
		'Your checklist learned and followed every visit',
		'Easy to pause, adjust or upgrade with a message',
		'Deep cleans and laundry can be added any time'
	];

	async function choose(key) {
		chosen = key;
		await tick();
		document.getElementById('plan-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	const planBy = $derived(Object.fromEntries(data.plans.map((p) => [p.key, p])));
</script>

<Seo seo={data.seo} path="/cleaning-plans" jsonld={[breadcrumbSchema(crumbs, data.siteUrl), faqSchema(PLAN_FAQS)]} />

<!-- 1. Hero -->
<section class="wrap pt-10 pb-20 sm:pt-14">
	<Breadcrumbs items={crumbs} />
	<div class="mt-8 grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
		<div>
			<h1 class="display text-[clamp(2.6rem,6.2vw,5.2rem)]">
				<span class="wipe-in inline-block">Enjoy a cleaner space, every day. Without the stress.</span>
			</h1>
			<p class="lede mt-6">
				Let BiceMeek take care of your cleaning routine. Choose daily, weekly or monthly cleaning and enjoy a spotless
				environment without worrying about the chores.
			</p>
		</div>
		<div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
			<button type="button" class="btn btn-sun" onclick={() => choose(chosen)}>Get my plan quote</button>
			<WhatsAppButton message={data.waMessage} label="Discuss a plan on WhatsApp" />
		</div>
	</div>
</section>

<!-- 2. Pain points -->
<section class="bg-ink py-20 text-paper sm:py-24" aria-labelledby="pain-title">
	<div class="wrap">
		<h2 id="pain-title" class="display max-w-3xl text-[clamp(2rem,4.2vw,3.4rem)]">Sound familiar?</h2>
		<ul class="mt-12 grid gap-px overflow-hidden rounded-[2rem] bg-paper/15 sm:grid-cols-2 lg:grid-cols-4">
			{#each pains as p}
				<li class="bg-ink p-7">
					<p.icon size={30} class="text-sun" aria-hidden="true" />
					<h3 class="mt-5 text-xl font-bold">{p.title}</h3>
					<p class="mt-2 text-paper/70">{p.text}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- 3 & 4. Solution and benefits -->
<section class="py-20 sm:py-28" aria-labelledby="solution-title">
	<div class="wrap grid gap-14 lg:grid-cols-2">
		<div>
			<h2 id="solution-title" class="display text-[clamp(2rem,4.2vw,3.4rem)]">A cleaning routine that runs itself</h2>
			<p class="lede mt-6">
				With a BiceMeek plan, you agree your schedule once. After that, our team arrives on your chosen days with
				everything needed, follows your checklist, and keeps your home or workplace at the same standard every time.
			</p>
			<p class="lede mt-4">You stop organising cleaning — and start enjoying the result.</p>
		</div>
		<ul class="grid gap-3 self-center">
			{#each benefits as b}
				<li class="flex items-start gap-4 rounded-2xl bg-mist px-5 py-4 text-lg">
					<span class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sun"><Check size={16} strokeWidth={3} aria-hidden="true" /></span>
					{b}
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- 5. Plan comparison -->
<section class="bg-mist py-20 sm:py-28" aria-labelledby="plans-title">
	<div class="wrap">
		<h2 id="plans-title" class="display text-[clamp(2rem,4.2vw,3.4rem)]">Choose your rhythm</h2>
		<p class="lede mt-4">Every plan is tailored to your space. Pick the frequency that fits and we’ll send a quotation.</p>
		<div class="mt-14"><PlanCompare plans={data.plans} onchoose={choose} /></div>

		<div class="mt-16 overflow-x-auto rounded-[1.75rem] bg-paper">
			<table class="w-full min-w-[640px] text-left">
				<caption class="sr-only">Plan comparison</caption>
				<thead>
					<tr class="border-b-2 border-ink">
						<th scope="col" class="p-5 text-sm text-slate">At a glance</th>
						{#each data.plans as p}<th scope="col" class="p-5 text-lg font-bold">{p.name}</th>{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-line">
					<tr>
						<th scope="row" class="p-5 font-semibold">How often</th>
						{#each data.plans as p}<td class="p-5">{p.key === 'daily' ? 'Your chosen weekdays' : p.key === 'weekly' ? 'Once a week' : 'Once a month'}</td>{/each}
					</tr>
					<tr>
						<th scope="row" class="p-5 font-semibold">Best for</th>
						{#each data.plans as p}<td class="p-5 text-slate">{p.bestFor}</td>{/each}
					</tr>
					<tr>
						<th scope="row" class="p-5 font-semibold">Price</th>
						{#each data.plans as p}<td class="p-5">{p.price ? `${formatNaira(p.price)} ${p.priceUnit}` : 'Custom quote'}</td>{/each}
					</tr>
					<tr>
						<th scope="row" class="p-5 font-semibold">Add laundry or deep clean</th>
						{#each data.plans as p}<td class="p-5"><Check size={20} strokeWidth={3} aria-label="Yes" /></td>{/each}
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</section>

<!-- 6. How it works -->
<section class="py-20 sm:py-28" aria-labelledby="how-title">
	<div class="wrap">
		<h2 id="how-title" class="display text-[clamp(2rem,4.2vw,3.4rem)]">How your plan starts</h2>
		<ol class="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
			{#each PROCESS as step, i}
				<li class="border-t-4 border-ink pt-6">
					<span class="display text-5xl text-sun-deep">{i + 1}</span>
					<h3 class="mt-3 text-xl font-bold">{step.title}</h3>
					<p class="mt-2 text-slate">{step.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- 7. Trust -->
<section class="bg-sun py-20 sm:py-24" aria-labelledby="trust-title">
	<div class="wrap">
		<h2 id="trust-title" class="display max-w-3xl text-[clamp(2rem,4.2vw,3.4rem)]">What you can count on</h2>
		<ul class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
			{#each VALUES as v}
				<li>
					<span class="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-sun"><ValueIcon name={v.icon} /></span>
					<h3 class="mt-4 text-xl font-bold">{v.title}</h3>
					<p class="mt-2 text-ink/80">{v.text}</p>
				</li>
			{/each}
		</ul>
		{#if data.testimonials.length}
			<div class="mt-14"><TestimonialList items={data.testimonials} /></div>
		{/if}
	</div>
</section>

<!-- 8. FAQ -->
<section class="py-20 sm:py-28" aria-labelledby="faq-title">
	<div class="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr]">
		<h2 id="faq-title" class="display text-[clamp(2rem,4.2vw,3.4rem)]">Plan questions</h2>
		<Faq faqs={PLAN_FAQS} />
	</div>
</section>

<!-- 9 & 10. Form + WhatsApp -->
<section id="plan-form" class="scroll-mt-20 bg-ink py-20 text-paper sm:py-28" aria-labelledby="form-title">
	<div class="wrap grid gap-14 lg:grid-cols-[1fr_1.3fr]">
		<div>
			<h2 id="form-title" class="display text-[clamp(2rem,4.2vw,3.4rem)]">Get your plan quotation</h2>
			<p class="mt-4 max-w-[44ch] text-lg text-paper/70">
				{#if planBy[chosen]}You’ve picked <strong class="text-sun">{planBy[chosen].name}</strong>. {/if}Tell us about your space and we’ll reply with a tailored quote.
			</p>
			<p class="mt-10 font-bold">Rather talk it through?</p>
			<div class="mt-3"><WhatsAppChooser message={data.waMessage} tone="dark" /></div>
		</div>
		<div class="rounded-[2rem] bg-graphite p-6 sm:p-10">
			{#key chosen}
				<BookingForm
					services={data.services}
					service="residential-cleaning"
					frequency={chosen}
					requestType="quote"
					tone="dark"
					source="cleaning-plans"
					heading=""
				/>
			{/key}
		</div>
	</div>
</section>
