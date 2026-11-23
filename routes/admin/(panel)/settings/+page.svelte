<script>
	import { enhance } from '$app/forms';
	import Notice from '$lib/components/admin/Notice.svelte';
	import MediaInput from '$lib/components/admin/MediaInput.svelte';

	let { data, form } = $props();
	const s = $derived(data.s);
	let busy = $state(false);

	// Editable rows (padded so there is always an empty row to add to).
	let phones = $state([...(data.s.phones ?? []), '', ''].slice(0, Math.max(3, (data.s.phones?.length ?? 0) + 1)));
	let wa = $state([...(data.s.whatsapp ?? []), { label: '', number: '' }]);
	let hours = $state([...(data.s.openingHours ?? []), { days: '', hours: '' }]);

	const done = () => async ({ update }) => {
		await update({ reset: false });
		busy = false;
	};
</script>

<svelte:head><title>Business settings · BiceMeek admin</title></svelte:head>

<h1 class="headline text-3xl">Business settings</h1>
<p class="mt-1 text-slate">Contact details, address, opening hours and images used across the website and in Google’s business data.</p>

<div class="mt-6">{#if form?.section !== 'password'}<Notice {form} />{/if}</div>

<form method="POST" action="?/save" enctype="multipart/form-data" class="space-y-6" use:enhance={() => { busy = true; return done(); }}>
	<section class="a-card grid gap-5 p-6 md:grid-cols-3">
		<h2 class="text-lg font-bold md:col-span-3">Brand</h2>
		<div><label class="field-label" for="businessName">Business name</label><input id="businessName" name="businessName" value={s.businessName} class="input" /></div>
		<div><label class="field-label" for="tagline">Tagline</label><input id="tagline" name="tagline" value={s.tagline} class="input" /></div>
		<div><label class="field-label" for="slogan">Slogan</label><input id="slogan" name="slogan" value={s.slogan} class="input" /></div>
	</section>

	<section class="a-card grid gap-6 p-6 lg:grid-cols-2">
		<div>
			<h2 class="text-lg font-bold">WhatsApp lines</h2>
			<p class="field-hint">Customers choose between these. The first line is the default for buttons.</p>
			<div class="mt-4 space-y-3">
				{#each wa as line, i}
					<div class="grid grid-cols-[1fr_1.3fr_auto] gap-2">
						<input name="waLabel" bind:value={line.label} placeholder="Label, e.g. Bookings line" class="input !py-2.5" aria-label="WhatsApp line {i + 1} label" />
						<input name="waNumber" bind:value={line.number} inputmode="tel" placeholder="2347016890048" class="input !py-2.5" aria-label="WhatsApp line {i + 1} number" />
						<button type="button" class="px-2 text-sm text-bad" onclick={() => wa.splice(i, 1)} aria-label="Remove line {i + 1}">Remove</button>
					</div>
				{/each}
			</div>
			<button type="button" class="mt-3 text-sm font-semibold underline" onclick={() => wa.push({ label: '', number: '' })}>Add a WhatsApp line</button>
		</div>
		<div>
			<h2 class="text-lg font-bold">Phone numbers</h2>
			<p class="field-hint">Shown for calls in the header, footer and contact page.</p>
			<div class="mt-4 space-y-3">
				{#each phones as _, i}
					<input name="phone" bind:value={phones[i]} inputmode="tel" placeholder="+2347016890048" class="input !py-2.5" aria-label="Phone {i + 1}" />
				{/each}
			</div>
			<button type="button" class="mt-3 text-sm font-semibold underline" onclick={() => phones.push('')}>Add a phone number</button>
			<div class="mt-6">
				<label class="field-label" for="email">Email</label>
				<input id="email" name="email" type="email" value={s.email ?? ''} class="input" placeholder="hello@yourdomain.com" />
			</div>
		</div>
	</section>

	<section class="a-card grid gap-5 p-6 md:grid-cols-2">
		<h2 class="text-lg font-bold md:col-span-2">Location</h2>
		<div class="md:col-span-2"><label class="field-label" for="streetAddress">Street address</label><input id="streetAddress" name="streetAddress" value={s.streetAddress} class="input" /></div>
		<div><label class="field-label" for="city">City</label><input id="city" name="city" value={s.city} class="input" /></div>
		<div><label class="field-label" for="state">State</label><input id="state" name="state" value={s.state} class="input" /></div>
		<div><label class="field-label" for="country">Country</label><input id="country" name="country" value={s.country} class="input" /></div>
		<div><label class="field-label" for="mapUrl">Google Maps link</label><input id="mapUrl" name="mapUrl" type="url" value={s.mapUrl ?? ''} class="input" /></div>
		<div class="md:col-span-2">
			<label class="field-label" for="googleBusinessUrl">Google Business Profile link</label>
			<input id="googleBusinessUrl" name="googleBusinessUrl" type="url" value={s.googleBusinessUrl ?? ''} class="input" placeholder="https://g.page/…" />
			<p class="field-hint">Once your Google Business Profile is live, paste its link here. It’s added to your structured data so Google connects the two.</p>
		</div>
	</section>

	<section class="a-card p-6">
		<h2 class="text-lg font-bold">Opening hours</h2>
		<p class="field-hint">Leave empty to hide. Example: “Monday – Saturday” and “8:00am – 6:00pm”.</p>
		<div class="mt-4 space-y-3">
			{#each hours as row, i}
				<div class="grid grid-cols-[1fr_1fr_auto] gap-2">
					<input name="hoursDays" bind:value={row.days} placeholder="Days" class="input !py-2.5" aria-label="Days {i + 1}" />
					<input name="hoursTime" bind:value={row.hours} placeholder="Hours" class="input !py-2.5" aria-label="Hours {i + 1}" />
					<button type="button" class="px-2 text-sm text-bad" onclick={() => hours.splice(i, 1)}>Remove</button>
				</div>
			{/each}
		</div>
		<button type="button" class="mt-3 text-sm font-semibold underline" onclick={() => hours.push({ days: '', hours: '' })}>Add a row</button>
	</section>

	<section class="a-card grid gap-5 p-6 md:grid-cols-3">
		<h2 class="text-lg font-bold md:col-span-3">Social media</h2>
		{#each [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['x', 'X (Twitter)'], ['linkedin', 'LinkedIn'], ['youtube', 'YouTube']] as [key, label]}
			<div><label class="field-label" for={key}>{label}</label><input id={key} name={key} type="url" value={s.social?.[key] ?? ''} class="input" placeholder="https://" /></div>
		{/each}
	</section>

	<section class="a-card grid gap-5 p-6 lg:grid-cols-2">
		<h2 class="text-lg font-bold lg:col-span-2">Website images</h2>
		<div class="space-y-3">
			<MediaInput name="hero" label="Homepage hero photo" current={s.heroImage} hint="A bright photo of your team or a freshly cleaned room. Portrait or square, up to 4 MB." />
			<label class="field-label" for="heroImageAlt">Hero photo description</label>
			<input id="heroImageAlt" name="heroImageAlt" value={s.heroImageAlt ?? ''} class="input" placeholder="e.g. BiceMeek cleaners in uniform in a Minna living room" />
		</div>
		<MediaInput name="about" label="About page photo" current={s.aboutImage} hint="Wide team photo works best." />
	</section>

	<section class="a-card grid gap-5 p-6 md:grid-cols-2">
		<h2 class="text-lg font-bold md:col-span-2">Google tools</h2>
		<div>
			<label class="field-label" for="ga">Google Analytics 4 measurement ID</label>
			<input id="ga" name="gaMeasurementId" value={s.gaMeasurementId ?? ''} placeholder="G-XXXXXXXXXX" class="input" disabled={data.envOverrides.ga} />
			<p class="field-hint">{data.envOverrides.ga ? 'Set by the PUBLIC_GA_MEASUREMENT_ID environment variable.' : 'Leave empty to keep analytics off.'}</p>
		</div>
		<div>
			<label class="field-label" for="gsc">Google Search Console verification code</label>
			<input id="gsc" name="googleSiteVerification" value={s.googleSiteVerification ?? ''} placeholder="content value from the HTML tag" class="input" disabled={data.envOverrides.gsc} />
			<p class="field-hint">{data.envOverrides.gsc ? 'Set by an environment variable.' : 'Paste only the content="…" value from Google’s HTML tag method.'}</p>
		</div>
	</section>

	<div class="sticky bottom-4 z-10 flex justify-end">
		<button class="btn btn-ink shadow-xl" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button>
	</div>
</form>

<section class="a-card mt-10 max-w-2xl p-6" id="account">
	<h2 class="text-lg font-bold">Your account</h2>
	<p class="field-hint">Change your sign-in email or password. Saving signs out your other devices.</p>
	<div class="mt-4">{#if form?.section === 'password'}<Notice {form} />{/if}</div>
	<form method="POST" action="?/password" class="grid gap-4 sm:grid-cols-2" use:enhance>
		<div><label class="field-label" for="a-name">Name</label><input id="a-name" name="name" value={data.admin.name ?? ''} class="input" /></div>
		<div><label class="field-label" for="a-email">Email</label><input id="a-email" name="email" type="email" value={data.admin.email} autocomplete="username" class="input" /></div>
		<div class="sm:col-span-2"><label class="field-label" for="current">Current password</label><input id="current" name="current" type="password" autocomplete="current-password" required class="input" /></div>
		<div><label class="field-label" for="next">New password</label><input id="next" name="next" type="password" minlength="12" autocomplete="new-password" required class="input" /></div>
		<div><label class="field-label" for="confirm">Repeat new password</label><input id="confirm" name="confirm" type="password" minlength="12" autocomplete="new-password" required class="input" /></div>
		<button class="btn btn-ink w-fit">Update account</button>
	</form>
</section>
