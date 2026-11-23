<script>
	import { MapPin, Phone, Mail, Clock, Navigation } from '@lucide/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import BookingForm from '$lib/components/BookingForm.svelte';
	import WhatsAppChooser from '$lib/components/WhatsAppChooser.svelte';
	import { breadcrumbSchema, businessSchema } from '$lib/seo.js';
	import { formatPhone, telLink, waMessage } from '$lib/whatsapp.js';

	let { data } = $props();
	const s = $derived(data.settings);
	const crumbs = [
		{ name: 'Home', path: '/' },
		{ name: 'Contact', path: '/contact' }
	];
	const mapQuery = $derived(encodeURIComponent(`${s.streetAddress}, ${s.city}, ${s.state}, Nigeria`));
</script>

<Seo seo={data.seo} path="/contact" jsonld={[businessSchema(s, data.siteUrl), breadcrumbSchema(crumbs, data.siteUrl)]} />

<section class="wrap pt-10 pb-16 sm:pt-14">
	<Breadcrumbs items={crumbs} />
	<h1 class="display mt-8 max-w-4xl text-[clamp(2.6rem,6vw,5rem)]">Contact our cleaning team in Minna</h1>
	<p class="lede mt-5">WhatsApp is the fastest way to reach us. You can also call, visit our office, or send a request below.</p>
</section>

<section class="wrap grid gap-6 pb-20 lg:grid-cols-3">
	<div class="rounded-[2rem] bg-ink p-8 text-paper lg:col-span-2">
		<h2 class="headline text-2xl">Message us on WhatsApp</h2>
		<p class="mt-2 text-paper/70">Choose either line — both reach our bookings team.</p>
		<div class="mt-6"><WhatsAppChooser message={waMessage.general(s.businessName)} tone="dark" /></div>
	</div>
	<div class="rounded-[2rem] bg-sun p-8">
		<h2 class="headline text-2xl">Call us</h2>
		<ul class="mt-5 space-y-3">
			{#each s.phones as p}
				<li><a href={telLink(p)} class="flex items-center gap-3 text-lg font-bold hover:underline"><Phone size={20} aria-hidden="true" />{formatPhone(p)}</a></li>
			{/each}
			{#if s.email}
				<li><a href="mailto:{s.email}" class="flex items-center gap-3 font-semibold break-all hover:underline"><Mail size={20} aria-hidden="true" />{s.email}</a></li>
			{/if}
		</ul>
	</div>
</section>

<section class="bg-mist py-20" aria-labelledby="visit-title">
	<div class="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]">
		<div>
			<h2 id="visit-title" class="headline text-3xl sm:text-4xl">Find us</h2>
			<address class="mt-6 space-y-4 text-lg not-italic">
				<p class="flex gap-3"><MapPin size={24} class="mt-0.5 shrink-0" aria-hidden="true" /><span>{s.streetAddress}<br />{s.city}, {s.state}<br />{s.country}</span></p>
			</address>
			{#if s.openingHours.length}
				<div class="mt-6 flex gap-3">
					<Clock size={24} class="mt-0.5 shrink-0" aria-hidden="true" />
					<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
						{#each s.openingHours as o}<dt class="font-semibold">{o.days}</dt><dd>{o.hours}</dd>{/each}
					</dl>
				</div>
			{:else}
				<p class="mt-6 flex gap-3 text-slate"><Clock size={24} class="shrink-0" aria-hidden="true" />Message us to arrange a visit or a cleaning time that suits you.</p>
			{/if}
			<div class="mt-8 flex flex-wrap gap-3">
				<a href={s.mapUrl || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener" class="btn btn-ink">
					<Navigation size={18} aria-hidden="true" /> Get directions
				</a>
				{#if s.googleBusinessUrl}
					<a href={s.googleBusinessUrl} target="_blank" rel="noopener" class="btn btn-ghost">See us on Google</a>
				{/if}
			</div>
			<p class="mt-8 max-w-[48ch] text-slate">
				We provide cleaning services throughout Minna — including homes, estates, offices and commercial premises — and can
				discuss jobs elsewhere in Niger State.
			</p>
		</div>
		<div class="overflow-hidden rounded-[2rem] bg-paper">
			<iframe
				title="Map showing {s.businessName} on {s.streetAddress}, {s.city}"
				src="https://maps.google.com/maps?q={mapQuery}&output=embed"
				class="h-[420px] w-full border-0"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
		</div>
	</div>
</section>

<section class="py-20" aria-labelledby="request-title">
	<div class="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
		<div>
			<h2 id="request-title" class="headline text-3xl sm:text-4xl">Send a request</h2>
			<p class="lede mt-4">Booking or quotation — we’ll reply to confirm details and price.</p>
		</div>
		<div class="rounded-[2rem] border-2 border-line p-6 sm:p-10">
			<BookingForm services={data.services} source="contact" heading="" />
		</div>
	</div>
</section>
