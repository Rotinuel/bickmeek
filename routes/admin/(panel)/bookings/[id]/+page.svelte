<script>
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { ArrowLeft, Phone, Mail, Trash2 } from '@lucide/svelte';
	import StatusBadge from '$lib/components/admin/StatusBadge.svelte';
	import Notice from '$lib/components/admin/Notice.svelte';
	import WhatsAppIcon from '$lib/components/WhatsAppIcon.svelte';
	import { BOOKING_STATUSES, frequencyLabel, statusLabel } from '$lib/constants.js';
	import { formatDate, formatDateTime, toInputDate } from '$lib/format.js';
	import { waLink, telLink } from '$lib/whatsapp.js';

	let { data, form } = $props();
	const b = $derived(data.booking);
	const waNumber = $derived(b.phone.replace(/^\+/, '').replace(/^0/, '234'));

	const rows = $derived([
		['Request type', b.requestType === 'quote' ? 'Quotation' : 'Booking'],
		['Service', b.serviceName],
		['Frequency', frequencyLabel(b.frequency)],
		['Preferred date', formatDate(b.preferredDate) || 'Not given'],
		['Preferred time', b.preferredTime || 'Not given'],
		['Property type', b.propertyType || 'Not given'],
		['Rooms / spaces', b.rooms || 'Not given'],
		['Address', b.address],
		['Area / landmark', b.area || 'Not given'],
		['Contact by', { whatsapp: 'WhatsApp', call: 'Phone call', email: 'Email' }[b.contactPreference]],
		['Submitted from', b.source || '—'],
		['Received', formatDateTime(b.createdAt)]
	]);
</script>

<svelte:head><title>{b.ref} · Bookings · BiceMeek admin</title></svelte:head>

<a href="/admin/bookings" class="inline-flex items-center gap-2 text-sm font-semibold hover:underline"><ArrowLeft size={16} /> All bookings</a>

<div class="mt-4 flex flex-wrap items-center gap-3">
	<h1 class="headline text-3xl">{b.ref}</h1>
	<StatusBadge status={b.status} />
</div>
<p class="mt-1 text-slate">{b.fullName}</p>

<div class="mt-6"><Notice {form} /></div>

<div class="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
	<div class="space-y-6">
		<section class="a-card p-6">
			<h2 class="text-lg font-bold">Customer</h2>
			<p class="mt-3 text-xl font-semibold">{b.fullName}</p>
			<div class="mt-4 flex flex-wrap gap-2">
				<a href={waLink(waNumber, `Hello ${b.fullName.split(' ')[0]}, this is BiceMeek Cleaning Services about your request ${b.ref}.`)} target="_blank" rel="noopener" class="btn btn-wa btn-sm">
					<WhatsAppIcon size={16} /> {b.phone}
				</a>
				<a href={telLink(waNumber)} class="btn btn-ghost btn-sm"><Phone size={16} aria-hidden="true" /> Call</a>
				{#if b.email}<a href="mailto:{b.email}?subject=Your BiceMeek request {b.ref}" class="btn btn-ghost btn-sm"><Mail size={16} aria-hidden="true" /> {b.email}</a>{/if}
			</div>
		</section>

		<section class="a-card p-6">
			<h2 class="text-lg font-bold">Request details</h2>
			<dl class="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
				{#each rows as [k, v]}
					<dt class="text-sm text-slate">{k}</dt>
					<dd class="font-medium">{v}</dd>
				{/each}
			</dl>
			{#if b.additionalRequests}
				<h3 class="mt-6 text-sm text-slate">Customer notes</h3>
				<p class="mt-1 whitespace-pre-line rounded-xl bg-mist p-4">{b.additionalRequests}</p>
			{/if}
		</section>

		<section class="a-card p-6">
			<h2 class="text-lg font-bold">History</h2>
			<ol class="mt-4 space-y-3">
				{#each [...b.statusHistory].reverse() as h}
					<li class="flex items-center gap-3 text-sm">
						<StatusBadge status={h.status} />
						<span class="text-slate">{formatDateTime(h.at)} by {h.by}</span>
					</li>
				{/each}
			</ol>
		</section>
	</div>

	<div class="space-y-6">
		<form method="POST" action="?/update" class="a-card space-y-5 p-6" use:enhance={() => async ({ update }) => { await update({ reset: false }); invalidate('admin:counts'); }}>
			<h2 class="text-lg font-bold">Manage</h2>
			<div>
				<label for="status" class="field-label">Status</label>
				<select id="status" name="status" class="input">
					{#each BOOKING_STATUSES as s}<option value={s.value} selected={b.status === s.value}>{s.label}</option>{/each}
				</select>
			</div>
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="scheduledDate" class="field-label">Scheduled date</label>
					<input id="scheduledDate" type="date" name="scheduledDate" value={toInputDate(b.scheduledDate)} class="input" />
				</div>
				<div>
					<label for="scheduledTime" class="field-label">Scheduled time</label>
					<input id="scheduledTime" name="scheduledTime" value={b.scheduledTime ?? ''} placeholder="e.g. 9:00am" class="input" />
				</div>
			</div>
			<div>
				<label for="adminNotes" class="field-label">Internal notes</label>
				<textarea id="adminNotes" name="adminNotes" rows="6" class="input" placeholder="Quote amount, team assigned, access notes…">{b.adminNotes ?? ''}</textarea>
				<p class="field-hint">Only visible to admins.</p>
			</div>
			<button class="btn btn-ink w-full">Save changes</button>
		</form>

		<form
			method="POST"
			action="?/delete"
			class="a-card p-6"
			use:enhance={({ cancel }) => {
				if (!confirm(`Delete ${b.ref} permanently? This cannot be undone.`)) cancel();
			}}
		>
			<h2 class="text-lg font-bold">Delete booking</h2>
			<p class="mt-1 text-sm text-slate">Removes this enquiry and its history permanently. Use “Cancelled” to keep a record instead.</p>
			<button class="btn btn-sm mt-4 border-2 border-bad text-bad hover:bg-bad hover:text-paper"><Trash2 size={16} aria-hidden="true" /> Delete permanently</button>
		</form>
	</div>
</div>
