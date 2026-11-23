<script>
	import Seo from '$lib/components/Seo.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import { formatPhone } from '$lib/whatsapp.js';

	let { data } = $props();
	const s = $derived(data.settings);
	const crumbs = [
		{ name: 'Home', path: '/' },
		{ name: 'Privacy policy', path: '/privacy-policy' }
	];
</script>

<Seo seo={{ title: `Privacy Policy | ${s.businessName}`, description: `How ${s.businessName} collects, uses and protects your personal information.` }} path="/privacy-policy" />

<article class="wrap pt-10 pb-24 sm:pt-14">
	<Breadcrumbs items={crumbs} />
	<h1 class="display mt-8 text-[clamp(2.4rem,5vw,4rem)]">Privacy policy</h1>
	<div class="prose-bm mt-8">
		<p>
			This policy explains how {s.businessName} (“we”, “us”) collects and uses personal information when you use this
			website or contact us. We handle personal data in line with the Nigeria Data Protection Act 2023.
		</p>

		<h2>What we collect</h2>
		<ul>
			<li>Details you give us in booking and quotation forms: name, phone number, email (optional), address, area, property details, preferred dates and any notes.</li>
			<li>Messages you send us by WhatsApp, phone or email.</li>
			<li>Basic technical information such as your IP address, used to protect our forms from abuse.</li>
			<li>If analytics is enabled, anonymous usage statistics collected by Google Analytics through cookies.</li>
		</ul>

		<h2>How we use it</h2>
		<ul>
			<li>To respond to your request, prepare quotations and schedule cleaning.</li>
			<li>To contact you about your booking by your preferred method.</li>
			<li>To keep records of the services we provide.</li>
			<li>To understand how the website is used and improve it.</li>
		</ul>
		<p>We do not sell your personal information. We do not send marketing messages without your permission.</p>

		<h2>Who can see it</h2>
		<p>
			Only authorised members of our team. Our website is hosted with trusted technology providers that store data on our
			behalf under appropriate safeguards. We may disclose information where the law requires it.
		</p>

		<h2>How long we keep it</h2>
		<p>We keep booking records for as long as needed to provide our services and meet legal and accounting obligations, then delete them.</p>

		<h2>Your rights</h2>
		<p>
			You can ask to see, correct or delete the personal information we hold about you, or object to how we use it.
			Contact us using the details below and we will respond promptly.
		</p>

		<h2>Contact</h2>
		<p>
			{s.businessName}, {s.fullAddress}.
			{#if s.phones?.[0]}Phone: {formatPhone(s.phones[0])}.{/if}
			{#if s.email}Email: {s.email}.{/if}
		</p>
		<p class="text-sm">Last updated: {new Date().getFullYear()}</p>
	</div>
</article>
