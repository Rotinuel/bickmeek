<script>
	import { tick } from 'svelte';
	import { Check, X, Sparkles, ShieldCheck, Clock3, HeartPulse, Users, Gem } from '@lucide/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import PlanCompare from '$lib/components/PlanCompare.svelte';
	import BookingForm from '$lib/components/BookingForm.svelte';
	import BeforeAfter from '$lib/components/BeforeAfter.svelte';
	import TestimonialList from '$lib/components/TestimonialList.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import WhatsAppButton from '$lib/components/WhatsAppButton.svelte';
	import WhatsAppChooser from '$lib/components/WhatsAppChooser.svelte';
	import { PLAN_FAQS } from '$lib/content.js';
	import { businessSchema, faqSchema } from '$lib/seo.js';

	let { data } = $props();
	let chosen = $state('weekly');

	async function toForm(key = chosen) {
		chosen = key;
		await tick();
		document.getElementById('get-quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	const without = [
		'Weekends spent sweeping, mopping and scrubbing',
		'Dust and grime creeping back days after a clean',
		'Finding, briefing and checking a new cleaner each time',
		'Embarrassment when guests or clients drop by'
	];
	const withPlan = [
		'A fixed cleaning day you never have to arrange',
		'A space that stays consistently clean',
		'The same trusted team that knows your preferences',
		'A home or office you’re proud to open the door to'
	];
	const benefits = [
		{ icon: Clock3, title: 'Hours back every week', text: 'Spend your free time on family, rest or business — not chores.' },
		{ icon: HeartPulse, title: 'A healthier space', text: 'Regular disinfection of kitchens, toilets and high-touch points keeps germs down.' },
		{ icon: Sparkles, title: 'Proper tools and products', text: 'We bring what the job needs and know which product suits which surface.' },
		{ icon: ShieldCheck, title: 'Reliable and accountable', text: 'A company you can call — with a reference number for every request.' },
		{ icon: Users, title: 'Consistent faces', text: 'Wherever possible, the same cleaner or team on your schedule.' },
		{ icon: Gem, title: 'Done to a standard', text: 'A written checklist, followed visit after visit.' }
	];
</script>

<Seo seo={data.seo} path="/cleaning-subscription" jsonld={[businessSchema(data.settings, data.siteUrl), faqSchema(PLAN_FAQS)]} />

<!-- Hero -->
<section class="relative overflow-hidden bg-ink pt-32 pb-20 text-paper sm:pt-40 sm:pb-28">
	<div class="streak pointer-events-none absolute inset-0 opacity-90" aria-hidden="true"></div>
	<div class="wrap relative">
		<p class="text-lg font-semibold text-sun">Regular home and office cleaning in Minna</p>
		<h1 class="display mt-5 max-w-5xl text-[clamp(2.8rem,7.5vw,6.4rem)]">Never spend another weekend cleaning.</h1>
		<p class="mt-6 max-w-[54ch] text-xl text-paper/75">
			Choose daily, weekly or monthly cleaning. Our team arrives on schedule, follows your checklist, and keeps your space
			spotless — so you don’t have to think about it.
		</p>
		<div class="mt-10 flex flex-col gap-3 sm:flex-row">
			<button type="button" class="btn btn-sun text-lg" onclick={() => toForm()}>Get my free quote</button>
			<WhatsAppButton message={data.waMessage} label="Get a quote on WhatsApp" />
		</div>
		<ul class="mt-12 flex flex-col gap-3 text-paper/85 sm:flex-row sm:gap-8">
			{#each ['No commitment until you approve the quote', 'Flexible: pause or change any time', 'Supplies brought by our team'] as point}
				<li class="flex items-center gap-2"><Check size={18} class="text-sun" strokeWidth={3} aria-hidden="true" />{point}</li>
			{/each}
		</ul>
	</div>
</section>

<!-- Problem / solution -->
<section class="py-20 sm:py-28" aria-labelledby="ps-title">
	<div class="wrap">
		<h2 id="ps-title" class="display max-w-3xl text-[clamp(2rem,4.4vw,3.6rem)]">Cleaning shouldn’t be a weekly battle.</h2>
		<div class="mt-12 grid gap-5 md:grid-cols-2">
			<div class="rounded-[2rem] border-2 border-line p-8">
				<h3 class="text-xl font-bold text-slate">Doing it yourself</h3>
				<ul class="mt-6 space-y-4">
					{#each without as w}
						<li class="flex gap-3"><X size={22} class="mt-0.5 shrink-0 text-bad" aria-hidden="true" />{w}</li>
					{/each}
				</ul>
			</div>
			<div class="rounded-[2rem] bg-sun p-8">
				<h3 class="text-xl font-bold">With a BiceMeek plan</h3>
				<ul class="mt-6 space-y-4">
					{#each withPlan as w}
						<li class="flex gap-3 font-semibold"><Check size={22} class="mt-0.5 shrink-0" strokeWidth={3} aria-hidden="true" />{w}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Benefits -->
<section class="bg-mist py-20 sm:py-28" aria-labelledby="benefits-title">
	<div class="wrap">
		<h2 id="benefits-title" class="display max-w-3xl text-[clamp(2rem,4.4vw,3.6rem)]">Why hire professional cleaners</h2>
		<ul class="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
			{#each benefits as b}
				<li>
					<b.icon size={30} aria-hidden="true" />
					<h3 class="mt-4 text-xl font-bold">{b.title}</h3>
					<p class="mt-2 text-slate">{b.text}</p>
				</li>
			{/each}
		</ul>
		<div class="mt-12"><button type="button" class="btn btn-ink" onclick={() => toForm()}>Get my free quote</button></div>
	</div>
</section>

<!-- Before / after -->
{#if data.beforeAfter.length}
	<section class="py-20 sm:py-28" aria-labelledby="ba-title">
		<div class="wrap">
			<h2 id="ba-title" class="display text-[clamp(2rem,4.4vw,3.6rem)]">The BiceMeek difference</h2>
			<p class="lede mt-4">Drag the slider to compare.</p>
			<div class="mt-10 grid gap-8 md:grid-cols-2">
				{#each data.beforeAfter as item (item._id)}
					<BeforeAfter before={item.beforeUrl} after={item.afterUrl} alt={item.alt || item.title} label={item.title} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Plans -->
<section class="bg-ink py-20 text-paper sm:py-28" aria-labelledby="plans-title">
	<div class="wrap">
		<h2 id="plans-title" class="display text-[clamp(2rem,4.4vw,3.6rem)]">Pick how often</h2>
		<p class="mt-4 max-w-[54ch] text-lg text-paper/70">Every plan is priced to your space. Choose one to get your tailored quotation.</p>
		<div class="mt-14 text-ink"><PlanCompare plans={data.plans} onchoose={toForm} /></div>
	</div>
</section>

<!-- Testimonials -->
{#if data.testimonials.length}
	<section class="py-20 sm:py-28" aria-labelledby="t-title">
		<div class="wrap">
			<h2 id="t-title" class="display text-[clamp(2rem,4.4vw,3.6rem)]">Customers on BiceMeek</h2>
			<div class="mt-12"><TestimonialList items={data.testimonials} /></div>
		</div>
	</section>
{/if}

<!-- FAQ -->
<section class="py-20 sm:py-28 {data.testimonials.length ? 'bg-mist' : ''}" aria-labelledby="faq-title">
	<div class="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr]">
		<h2 id="faq-title" class="display text-[clamp(2rem,4.4vw,3.6rem)]">Before you ask</h2>
		<Faq faqs={PLAN_FAQS} />
	</div>
</section>

<!-- Lead capture -->
<section id="get-quote" class="scroll-mt-4 bg-sun py-20 sm:py-28" aria-labelledby="quote-title">
	<div class="wrap grid gap-12 lg:grid-cols-[1fr_1.3fr]">
		<div>
			<h2 id="quote-title" class="display text-[clamp(2rem,4.4vw,3.6rem)]">Get your free quote</h2>
			<p class="mt-4 max-w-[44ch] text-lg text-ink/80">Takes two minutes. We’ll contact you with a price for your space — no obligation.</p>
			<p class="mt-10 font-bold">Faster on WhatsApp?</p>
			<div class="mt-3"><WhatsAppChooser message={data.waMessage} /></div>
		</div>
		<div class="rounded-[2rem] bg-paper p-6 sm:p-10">
			{#key chosen}
				<BookingForm
					services={data.services}
					service="residential-cleaning"
					frequency={chosen}
					requestType="quote"
					source="landing:cleaning-subscription"
					heading=""
				/>
			{/key}
		</div>
	</div>
</section>

<!-- Final conversion -->
<section class="bg-ink py-20 text-paper sm:py-24">
	<div class="wrap text-center">
		<h2 class="display mx-auto max-w-4xl text-[clamp(2.2rem,5vw,4.2rem)]">We clean. You relax.</h2>
		<p class="mx-auto mt-5 max-w-[48ch] text-lg text-paper/70">{data.settings.slogan}</p>
		<div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
			<button type="button" class="btn btn-sun" onclick={() => toForm()}>Get my free quote</button>
			<WhatsAppButton message={data.waMessage} label="Chat on WhatsApp" />
		</div>
	</div>
</section>

<!-- Sticky mobile action bar -->
<div class="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-paper/95 p-3 backdrop-blur sm:hidden">
	<button type="button" class="btn btn-sun flex-1" onclick={() => toForm()}>Free quote</button>
	<WhatsAppButton message={data.waMessage} label="WhatsApp" class="btn btn-wa flex-1" />
</div>
