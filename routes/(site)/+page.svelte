<script>
	import { MapPin, Phone, Repeat, Sparkle, Building2 } from '@lucide/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import HeroVisual from '$lib/components/HeroVisual.svelte';
	import ServiceRows from '$lib/components/ServiceRows.svelte';
	import PlanCompare from '$lib/components/PlanCompare.svelte';
	import BeforeAfter from '$lib/components/BeforeAfter.svelte';
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import TestimonialList from '$lib/components/TestimonialList.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import BookingForm from '$lib/components/BookingForm.svelte';
	import WhatsAppButton from '$lib/components/WhatsAppButton.svelte';
	import WhatsAppChooser from '$lib/components/WhatsAppChooser.svelte';
	import ValueIcon from '$lib/components/ValueIcon.svelte';
	import { GENERAL_FAQS, PROCESS, VALUES } from '$lib/content.js';
	import { businessSchema, faqSchema, websiteSchema } from '$lib/seo.js';
	import { formatPhone, telLink, waMessage } from '$lib/whatsapp.js';

	let { data } = $props();
	const s = $derived(data.settings);

	const paths = [
		{
			icon: Sparkle,
			title: 'Book a one-time clean',
			text: 'Deep clean, move-in/out or a fresh start for your home.',
			href: '/book?frequency=one_time'
		},
		{
			icon: Repeat,
			title: 'Subscribe to regular cleaning',
			text: 'Daily, weekly or monthly — on a schedule that suits you.',
			href: '/cleaning-plans'
		},
		{
			icon: Building2,
			title: 'Request a commercial quote',
			text: 'Offices, shops, schools and post-construction projects.',
			href: '/book?type=quote&service=office-cleaning'
		}
	];
</script>

<Seo seo={data.seo} path="/" jsonld={[businessSchema(s, data.siteUrl), websiteSchema(s, data.siteUrl), faqSchema(GENERAL_FAQS)]} />

<!-- Hero -->
<section class="overflow-hidden">
	<div class="wrap grid items-center gap-14 pt-10 pb-20 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-24">
		<div>
			<p class="inline-flex items-center gap-2 rounded-full bg-mist px-4 py-2 text-sm font-semibold">
				<MapPin size={16} aria-hidden="true" /> Professional cleaners in Minna, Niger State
			</p>
			<h1 class="display mt-6 text-[clamp(2.6rem,6.4vw,5.4rem)]">
				<span class="wipe-in inline-block">Your space deserves more than just a clean.</span>
			</h1>
			<p class="lede mt-6">
				Professional cleaning for homes, offices and businesses. Whether you need a one-time deep clean or a daily, weekly or
				monthly routine, BiceMeek makes cleanliness effortless.
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<a href="/book" class="btn btn-sun">Book a cleaning</a>
				<a href="/services" class="btn btn-ghost">Explore our services</a>
			</div>
			<div class="mt-5">
				<WhatsAppButton
					message={waMessage.general(s.businessName)}
					label="Or chat with us on WhatsApp"
					class="inline-flex items-center gap-2 font-semibold text-[#177040] underline-offset-4 hover:underline"
				/>
			</div>
		</div>
		<HeroVisual image={s.heroImage} alt={s.heroImageAlt} />
	</div>

	<!-- Three ways in -->
	<div class="wrap pb-16">
		<ul class="grid overflow-hidden rounded-[2rem] bg-ink text-paper md:grid-cols-3">
			{#each paths as p, i}
				<li class={i > 0 ? 'border-t border-paper/15 md:border-t-0 md:border-l' : ''}>
					<a href={p.href} class="group flex h-full gap-4 p-7 transition-colors hover:bg-graphite sm:p-8">
						<span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sun text-ink">
							<p.icon size={22} aria-hidden="true" />
						</span>
						<span>
							<span class="block text-lg font-bold group-hover:text-sun">{p.title}</span>
							<span class="mt-1 block text-paper/70">{p.text}</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- Services -->
<section class="py-20 sm:py-24" aria-labelledby="services-title">
	<div class="wrap">
		<div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
			<div>
				<h2 id="services-title" class="display text-[clamp(2.2rem,4.5vw,3.6rem)]">What we clean</h2>
				<p class="lede mt-4">From a single flat to a full office floor, every job follows a clear checklist and is done by our own team.</p>
			</div>
			<a href="/services" class="btn btn-ghost shrink-0">All services</a>
		</div>
		<div class="mt-12">
			<ServiceRows services={data.services} />
		</div>
	</div>
</section>

<!-- Plans -->
<section class="bg-mist py-20 sm:py-28" aria-labelledby="plans-title">
	<div class="wrap">
		<div class="max-w-3xl">
			<h2 id="plans-title" class="display text-[clamp(2.2rem,4.5vw,3.6rem)]">Stop scheduling cleaners. Get a plan.</h2>
			<p class="lede mt-4">
				A regular plan means the same trusted team, a fixed day, and a space that stays clean instead of slipping between visits.
			</p>
		</div>
		<div class="mt-14">
			<PlanCompare plans={data.plans} />
		</div>
		<p class="mt-10 text-center">
			<a href="/cleaning-plans" class="font-bold underline underline-offset-4 hover:text-slate">Compare plans in detail and see how they work</a>
		</p>
	</div>
</section>

<!-- Why choose us -->
<section class="py-20 sm:py-28" aria-labelledby="why-title">
	<div class="wrap grid gap-14 lg:grid-cols-[1fr_1.4fr]">
		<div>
			<h2 id="why-title" class="display text-[clamp(2.2rem,4.5vw,3.6rem)]">Why Minna trusts BiceMeek</h2>
			<p class="lede mt-4">We built our service around the four things customers tell us matter most when they let a cleaner into their space.</p>
			<p class="mt-8 text-xl font-bold">“{s.slogan}”</p>
		</div>
		<ul class="grid gap-x-10 gap-y-12 sm:grid-cols-2">
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

<!-- Before / after + gallery -->
{#if data.beforeAfter.length || data.galleryPreview.length}
	<section class="bg-ink py-20 text-paper sm:py-28" aria-labelledby="work-title">
		<div class="wrap">
			<div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
				<div>
					<h2 id="work-title" class="display text-[clamp(2.2rem,4.5vw,3.6rem)]">See the difference</h2>
					<p class="mt-4 max-w-[56ch] text-lg text-paper/70">Real jobs from our team. Drag the slider to compare before and after.</p>
				</div>
				<a href="/gallery" class="btn btn-ghost-light shrink-0">View all our work</a>
			</div>
			{#if data.beforeAfter.length}
				<div class="mt-12 grid gap-8 md:grid-cols-2">
					{#each data.beforeAfter as item (item._id)}
						<BeforeAfter before={item.beforeUrl} after={item.afterUrl} alt={item.alt || item.title} label={item.title} />
					{/each}
				</div>
			{/if}
			{#if data.galleryPreview.length}
				<div class="mt-12"><GalleryGrid items={data.galleryPreview} filters={false} /></div>
			{/if}
		</div>
	</section>
{/if}

<!-- How it works -->
<section class="py-20 sm:py-28" aria-labelledby="how-title">
	<div class="wrap">
		<h2 id="how-title" class="display max-w-3xl text-[clamp(2.2rem,4.5vw,3.6rem)]">How booking works</h2>
		<ol class="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
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

<!-- Testimonials -->
{#if data.testimonials.length}
	<section class="pb-20 sm:pb-28" aria-labelledby="reviews-title">
		<div class="wrap">
			<div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
				<h2 id="reviews-title" class="display text-[clamp(2.2rem,4.5vw,3.6rem)]">What customers say</h2>
				<a href="/testimonials" class="btn btn-ghost shrink-0">Read all reviews</a>
			</div>
			<div class="mt-12"><TestimonialList items={data.testimonials} /></div>
		</div>
	</section>
{/if}

<!-- FAQ -->
<section class="bg-mist py-20 sm:py-28" aria-labelledby="faq-title">
	<div class="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr]">
		<div>
			<h2 id="faq-title" class="display text-[clamp(2.2rem,4.5vw,3.6rem)]">Questions, answered</h2>
			<p class="lede mt-4">Can’t find what you need? Ask us directly on WhatsApp.</p>
			<div class="mt-6">
				<WhatsAppButton message={waMessage.general(s.businessName)} label="Ask a question" />
			</div>
		</div>
		<Faq faqs={GENERAL_FAQS} />
	</div>
</section>

<!-- Booking + contact -->
<section id="book" class="bg-ink py-20 text-paper sm:py-28" aria-labelledby="book-title">
	<div class="wrap grid gap-14 lg:grid-cols-[1fr_1.3fr]">
		<div>
			<h2 id="book-title" class="display text-[clamp(2.2rem,4.5vw,3.6rem)]">Let’s get your space sorted</h2>
			<p class="mt-4 max-w-[46ch] text-lg text-paper/70">
				Send a request and we’ll call or WhatsApp you to confirm. Prefer to talk now? Pick a line below.
			</p>
			<div class="mt-8"><WhatsAppChooser message={waMessage.general(s.businessName)} tone="dark" /></div>
			<div class="mt-8 space-y-3 text-paper/85">
				<p class="flex gap-3"><MapPin size={20} class="mt-0.5 shrink-0 text-sun" aria-hidden="true" />{s.fullAddress}</p>
				{#each s.phones as p}
					<p class="flex gap-3"><Phone size={20} class="mt-0.5 shrink-0 text-sun" aria-hidden="true" /><a href={telLink(p)} class="hover:text-sun">{formatPhone(p)}</a></p>
				{/each}
			</div>
		</div>
		<div class="rounded-[2rem] bg-graphite p-6 sm:p-10">
			<BookingForm services={data.services} tone="dark" source="homepage" heading="" />
		</div>
	</div>
</section>
