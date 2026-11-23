<script>
	import { MapPin, ShieldCheck, MessageCircle, CalendarClock } from '@lucide/svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import BookingForm from '$lib/components/BookingForm.svelte';
	import WhatsAppChooser from '$lib/components/WhatsAppChooser.svelte';
	import { breadcrumbSchema } from '$lib/seo.js';
	import { waMessage } from '$lib/whatsapp.js';

	let { data } = $props();
	const crumbs = [
		{ name: 'Home', path: '/' },
		{ name: 'Book a cleaning', path: '/book' }
	];
</script>

<Seo seo={data.seo} path="/book" jsonld={[breadcrumbSchema(crumbs, data.siteUrl)]} />

<section class="wrap pt-10 pb-24 sm:pt-14">
	<Breadcrumbs items={crumbs} />
	<div class="mt-8 grid gap-14 lg:grid-cols-[1fr_1.5fr]">
		<aside class="lg:sticky lg:top-28 lg:self-start">
			<h1 class="display text-[clamp(2.4rem,5vw,4rem)]">Book a cleaning or get a quote</h1>
			<p class="lede mt-5">It takes about two minutes. One of our team will contact you to confirm everything before your clean.</p>
			<ul class="mt-8 space-y-5">
				<li class="flex gap-4">
					<CalendarClock size={24} class="mt-0.5 shrink-0" aria-hidden="true" />
					<span><strong class="block">You choose the day and time</strong><span class="text-slate">We confirm availability with you.</span></span>
				</li>
				<li class="flex gap-4">
					<ShieldCheck size={24} class="mt-0.5 shrink-0" aria-hidden="true" />
					<span><strong class="block">No commitment until you agree</strong><span class="text-slate">You’ll get a clear price first.</span></span>
				</li>
				<li class="flex gap-4">
					<MapPin size={24} class="mt-0.5 shrink-0" aria-hidden="true" />
					<span><strong class="block">Across Minna</strong><span class="text-slate">Homes, offices and business premises.</span></span>
				</li>
			</ul>
			<div class="mt-10 rounded-[1.75rem] bg-mist p-6">
				<p class="flex items-center gap-2 font-bold"><MessageCircle size={20} aria-hidden="true" /> Prefer WhatsApp?</p>
				<div class="mt-4"><WhatsAppChooser message={waMessage.general(data.settings.businessName)} /></div>
			</div>
		</aside>
		<div class="rounded-[2rem] border-2 border-line p-6 sm:p-10">
			<BookingForm services={data.services} source="book" />
		</div>
	</div>
</section>
