<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

	let { data } = $props();
	const s = $derived(data.settings);
	const crumbs = [
		{ name: 'Home', path: '/' },
		{ name: 'Terms of service', path: '/terms' }
	];
</script>

<Seo seo={{ title: `Terms of Service | ${s.businessName}`, description: `Terms for booking cleaning services with ${s.businessName}.` }} path="/terms" />

<article class="wrap pt-10 pb-24 sm:pt-14">
	<Breadcrumbs items={crumbs} />
	<h1 class="display mt-8 text-[clamp(2.4rem,5vw,4rem)]">Terms of service</h1>
	<div class="prose-bm mt-8">
		<p>These terms apply when you request or book cleaning services from {s.businessName} through this website, WhatsApp, phone or in person.</p>

		<h2>Booking requests</h2>
		<p>
			Submitting a form on this website sends us a booking or quotation request. It is not a confirmed booking. A booking
			is confirmed only when we have agreed the scope, date, time and price with you.
		</p>

		<h2>Quotations and prices</h2>
		<p>
			Quotations are based on the information you give us. If the space, its condition or the work required differs
			significantly on the day, we will discuss any change with you before continuing.
		</p>

		<h2>Recurring plans</h2>
		<p>
			Daily, weekly and monthly plans follow the schedule agreed with you. Changes, pauses and cancellations should be
			requested in advance; notice periods and payment terms are confirmed when your plan is set up.
		</p>

		<h2>Access and safety</h2>
		<p>
			Please make sure we can access the agreed areas at the agreed time, with water and electricity available where
			needed. Let us know about pets, fragile items, valuables or areas we should avoid.
		</p>

		<h2>Rescheduling</h2>
		<p>If you need to change a booking, contact us as early as possible. We will do the same if we ever need to reschedule.</p>

		<h2>Satisfaction</h2>
		<p>If something on the agreed checklist was missed, tell us promptly so we can work with you to put it right.</p>

		<h2>Liability</h2>
		<p>
			We take care with your property. If you believe something was damaged during our work, tell us as soon as possible
			so we can look into it with you.
		</p>

		<h2>Changes to these terms</h2>
		<p>We may update these terms from time to time. The version on this page applies to new bookings.</p>
	</div>
</article>
