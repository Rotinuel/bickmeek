<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { CircleCheck, LoaderCircle, TriangleAlert } from '@lucide/svelte';
	import { FREQUENCIES, PROPERTY_TYPES, TIME_WINDOWS, frequencyLabel } from '$lib/constants.js';
	import { todayInLagos, formatDate } from '$lib/format.js';
	import { waMessage } from '$lib/whatsapp.js';
	import WhatsAppChooser from './WhatsAppChooser.svelte';

	let {
		services = [],
		service = '',
		frequency = 'one_time',
		requestType = 'booking',
		source = '',
		tone = 'light',
		heading = 'Request a cleaning',
		intro = 'Tell us what you need. We’ll contact you to confirm the date, time and price — nothing is booked until you agree.'
	} = $props();

	const uid = $props.id();
	let submitting = $state(false);
	let result = $state(null); // { success, ref, summary } | { errors, message, values }
	let formEl = $state();

	// Form state, prefilled from props/URL so CTAs like ?service=deep-cleaning&frequency=weekly work.
	let values = $state({
		requestType: page.url.searchParams.get('type') === 'quote' ? 'quote' : requestType,
		service: page.url.searchParams.get('service') || service,
		frequency: page.url.searchParams.get('frequency') || frequency,
		preferredDate: '',
		preferredTime: '',
		fullName: '',
		phone: '',
		email: '',
		contactPreference: 'whatsapp',
		address: '',
		area: '',
		propertyType: '',
		rooms: '',
		additionalRequests: ''
	});

	const errors = $derived(result?.errors ?? {});
	const dark = $derived(tone === 'dark');
	const today = todayInLagos();
	const label = 'field-label' + (tone === 'dark' ? ' !text-paper' : '');
	const hint = 'field-hint' + (tone === 'dark' ? ' !text-paper/65' : '');

	function submit() {
		submitting = true;
		return async ({ result: r, update }) => {
			submitting = false;
			if (r.type === 'success') {
				result = r.data;
				formEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			} else if (r.type === 'failure') {
				result = r.data;
				if (r.data?.values) Object.assign(values, r.data.values, { service: r.data.values.serviceSlug ?? values.service });
				queueMicrotask(() => formEl?.querySelector('[aria-invalid="true"]')?.focus());
			} else if (r.type === 'error') {
				result = { message: 'We could not send your request. Check your connection and try again, or message us on WhatsApp.' };
			} else {
				await update();
			}
		};
	}

	function reset() {
		result = null;
		values.additionalRequests = '';
	}

	const successMessage = $derived(
		result?.success
			? waMessage.booking(
					result.ref,
					{
						...result.summary,
						frequencyLabel: frequencyLabel(result.summary?.frequency),
						preferredDate: result.summary?.preferredDate ? formatDate(result.summary.preferredDate) : ''
					},
					page.data.settings?.businessName
				)
			: ''
	);
</script>

<div bind:this={formEl} class="scroll-mt-28">
	{#if result?.success}
		<div class="rounded-[2rem] p-7 sm:p-10 {dark ? 'bg-paper text-ink' : 'bg-sun-soft'}" role="status" aria-live="polite">
			<CircleCheck size={44} class="text-ok" aria-hidden="true" />
			<h3 class="headline mt-4 text-3xl">Request received</h3>
			<p class="mt-3 max-w-[56ch] text-slate">
				Thank you{result.summary?.name ? `, ${result.summary.name.split(' ')[0]}` : ''}. Your reference is
				<strong class="text-ink">{result.ref}</strong>. A member of our team will contact you shortly to confirm the details and price.
				Your booking is confirmed only after that conversation.
			</p>
			<p class="mt-6 font-bold">Want a faster reply? Continue on WhatsApp:</p>
			<div class="mt-3"><WhatsAppChooser message={successMessage} /></div>
			<button type="button" class="btn btn-ghost btn-sm mt-6" onclick={reset}>Send another request</button>
		</div>
	{:else}
		<form method="POST" action="?/book" use:enhance={submit} novalidate class="space-y-6">
			{#if heading}
				<div>
					<h3 class="headline text-3xl">{heading}</h3>
					{#if intro}<p class="mt-2 {dark ? 'text-paper/70' : 'text-slate'}">{intro}</p>{/if}
				</div>
			{/if}

			{#if result?.message}
				<div class="flex gap-3 rounded-2xl border-2 border-bad bg-paper p-4 text-ink" role="alert">
					<TriangleAlert size={22} class="shrink-0 text-bad" aria-hidden="true" />
					<p class="font-semibold">{result.message}</p>
				</div>
			{/if}

			<input type="hidden" name="source" value={source || page.url.pathname} />
			<!-- Honeypot field for bots -->
			<div class="absolute -left-[9999px]" aria-hidden="true">
				<label>Company website <input type="text" name="company_website" tabindex="-1" autocomplete="off" /></label>
			</div>

			<fieldset>
				<legend class={label}>What would you like?</legend>
				<div class="grid grid-cols-2 gap-2">
					{#each [['booking', 'Book a cleaning'], ['quote', 'Get a quotation']] as [v, l]}
						<label
							class="flex cursor-pointer items-center justify-center rounded-xl border-2 px-3 py-3 text-center font-bold transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-sun {dark
								? 'border-paper/25 has-[:checked]:border-sun has-[:checked]:bg-sun has-[:checked]:text-ink'
								: 'border-line'}"
						>
							<input type="radio" name="requestType" value={v} bind:group={values.requestType} class="sr-only" />
							{l}
						</label>
					{/each}
				</div>
			</fieldset>

			<div>
				<label for="{uid}-service" class={label}>Service</label>
				<select id="{uid}-service" name="service" class="input" bind:value={values.service} aria-invalid={!!errors.service} required>
					<option value="" disabled>Choose a service</option>
					{#each services as s}
						<option value={s.slug}>{s.name}</option>
					{/each}
				</select>
				{#if errors.service}<p class="field-error">{errors.service}</p>{/if}
			</div>

			<fieldset>
				<legend class={label}>How often?</legend>
				<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
					{#each FREQUENCIES as f}
						<label
							class="flex cursor-pointer items-center justify-center rounded-xl border-2 px-2 py-3 text-center text-sm font-bold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-sun {dark
								? 'border-paper/25 has-[:checked]:border-sun has-[:checked]:bg-sun has-[:checked]:text-ink'
								: 'border-line has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper'}"
						>
							<input type="radio" name="frequency" value={f.value} bind:group={values.frequency} class="sr-only" />
							{f.value === 'one_time' ? 'One-time' : f.label}
						</label>
					{/each}
				</div>
				{#if errors.frequency}<p class="field-error">{errors.frequency}</p>{/if}
			</fieldset>

			<div class="grid gap-5 sm:grid-cols-2">
				<div>
					<label for="{uid}-date" class={label}>{values.frequency === 'one_time' ? 'Preferred date' : 'Preferred start date'}</label>
					<input id="{uid}-date" type="date" name="preferredDate" min={today} class="input" bind:value={values.preferredDate} aria-invalid={!!errors.preferredDate} />
					{#if errors.preferredDate}<p class="field-error">{errors.preferredDate}</p>{/if}
				</div>
				<div>
					<label for="{uid}-time" class={label}>Preferred time</label>
					<select id="{uid}-time" name="preferredTime" class="input" bind:value={values.preferredTime} aria-invalid={!!errors.preferredTime}>
						<option value="">Choose a time window</option>
						{#each TIME_WINDOWS as t}<option value={t}>{t}</option>{/each}
					</select>
					{#if errors.preferredTime}<p class="field-error">{errors.preferredTime}</p>{/if}
				</div>
			</div>

			<div class="grid gap-5 sm:grid-cols-2">
				<div>
					<label for="{uid}-property" class={label}>Property type</label>
					<select id="{uid}-property" name="propertyType" class="input" bind:value={values.propertyType} aria-invalid={!!errors.propertyType}>
						<option value="">Choose one</option>
						{#each PROPERTY_TYPES as p}<option value={p}>{p}</option>{/each}
					</select>
					{#if errors.propertyType}<p class="field-error">{errors.propertyType}</p>{/if}
				</div>
				<div>
					<label for="{uid}-rooms" class={label}>Number of rooms or spaces</label>
					<input id="{uid}-rooms" name="rooms" class="input" placeholder="e.g. 3 bedrooms, 2 toilets" bind:value={values.rooms} maxlength="60" />
				</div>
			</div>

			<div class="grid gap-5 sm:grid-cols-2">
				<div>
					<label for="{uid}-name" class={label}>Full name</label>
					<input id="{uid}-name" name="fullName" autocomplete="name" class="input" bind:value={values.fullName} aria-invalid={!!errors.fullName} required maxlength="120" />
					{#if errors.fullName}<p class="field-error">{errors.fullName}</p>{/if}
				</div>
				<div>
					<label for="{uid}-phone" class={label}>Phone number</label>
					<input id="{uid}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0803 123 4567" class="input" bind:value={values.phone} aria-invalid={!!errors.phone} required />
					{#if errors.phone}<p class="field-error">{errors.phone}</p>{/if}
				</div>
			</div>

			<div class="grid gap-5 sm:grid-cols-2">
				<div>
					<label for="{uid}-email" class={label}>Email <span class="font-normal opacity-70">(optional)</span></label>
					<input id="{uid}-email" name="email" type="email" autocomplete="email" class="input" bind:value={values.email} aria-invalid={!!errors.email} />
					{#if errors.email}<p class="field-error">{errors.email}</p>{/if}
				</div>
				<div>
					<label for="{uid}-pref" class={label}>Best way to reach you</label>
					<select id="{uid}-pref" name="contactPreference" class="input" bind:value={values.contactPreference}>
						<option value="whatsapp">WhatsApp</option>
						<option value="call">Phone call</option>
						<option value="email">Email</option>
					</select>
				</div>
			</div>

			<div>
				<label for="{uid}-address" class={label}>Address</label>
				<input id="{uid}-address" name="address" autocomplete="street-address" class="input" placeholder="House number and street" bind:value={values.address} aria-invalid={!!errors.address} required maxlength="300" />
				{#if errors.address}<p class="field-error">{errors.address}</p>{/if}
			</div>
			<div>
				<label for="{uid}-area" class={label}>Area or nearest landmark</label>
				<input id="{uid}-area" name="area" class="input" placeholder="e.g. Bosso, Tunga, Chanchaga" bind:value={values.area} maxlength="120" />
				<p class={hint}>Helps our team find you quickly.</p>
			</div>

			<div>
				<label for="{uid}-notes" class={label}>Anything else we should know?</label>
				<textarea id="{uid}-notes" name="additionalRequests" rows="4" class="input" placeholder="Special requests, problem areas, pets, access instructions…" bind:value={values.additionalRequests} maxlength="2000"></textarea>
			</div>

			<button type="submit" class="btn w-full sm:w-auto {dark ? 'btn-sun' : 'btn-ink'}" disabled={submitting}>
				{#if submitting}
					<LoaderCircle size={20} class="animate-spin" aria-hidden="true" /> Sending request…
				{:else}
					{values.requestType === 'quote' ? 'Request my quotation' : 'Send booking request'}
				{/if}
			</button>
			<p class="{hint} !mt-3">
				By sending this form you agree that we may contact you about your request. See our <a href="/privacy-policy" class="underline">privacy policy</a>.
			</p>
		</form>
	{/if}
</div>
